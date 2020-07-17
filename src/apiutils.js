const { ApiError, CliError } = require('./errors');
const numbers = require('@bandwidth/numbers');
const printer = require('./printer');

const placeNumberOrder = async (phoneNumbers, siteId, peerId) => {
    if (!phoneNumbers.length) {return printer.warn('You did not select any numbers and the order has been aborted.')}
    const truncated = (phoneNumbers.length - 20);
    phoneNumbers.slice(0, 20).forEach((phoneNumber) => {
      printer.print(phoneNumber)
    });
    printer.printIf(truncated > 0, `[and ${truncated} more]`)
    const answer = (await printer.prompt('confirmNumberOrder', phoneNumbers)).confirmNumberOrder;
    if (!answer){return;}
    var order = {
      name:"Bandwidth Cli Order",
      siteId: siteId,
      existingTelephoneNumberOrderType: {
        telephoneNumberList:[
          {
            telephoneNumber:phoneNumbers
          }
        ]
      }
    };
    const createdOrder = await numbers.Order.createAsync(order).then(orderResponse => orderResponse.order).catch(err => {throw new ApiError(err)});
    printer.success('Your order was placed. Awaiting order completion...')
    await checkOrderStatus(createdOrder);
    printer.print(`Phone numbers can be found under sip peer ${peerId}`)
  }
  
  const placeCategoryOrder = async (quantity, orderType, query, siteId, peerId) => {
    var order = {
      name:"Bandwidth Quickstart Order",
      siteId: siteId,
      peerId: peerId
    };
    printer.print('You have selected the following:')
    const displayedQuery = Object.entries(query).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
    printer.printObj(displayedQuery)
    query.quantity = quantity;
    const answer = (await printer.prompt('confirmCategoryOrder', query)).confirmCategoryOrder;
    if (!answer){return;}
    order[orderType] = query
    const createdOrder = await numbers.Order.createAsync(order).then(orderResponse => orderResponse.order).catch(err => {throw new ApiError(err)});
    printer.success('Your order was placed. Awaiting order completion...')
    printer.removeClient(await checkOrderStatus(createdOrder));
    printer.print(`Phone numbers can be found under sip peer ${peerId}`)
  }
  
  /**
   * Continuously checks the status of the order until the order is complete, or
   * until 10 attempts have been made with no response.
   */
  const checkOrderStatus = async(order) => {
    let orderStatus
    for await (_ of [...Array(10).keys()]) {
      orderStatus = (await order.getHistoryAsync()).pop();
      if (orderStatus) {
        delete orderStatus.author
        const tns = await order.getTnsAsync();
        orderStatus.telephoneNumbers = tns.telephoneNumber
        return orderStatus;
      }
      await sleep(250);
    }
    printer.warn('Order placed but not complete.')
    return orderStatus
  }
  
  /**
   * Continuously checks the status of the order until the order is complete, or
   * until 10 attempts have been made with no response.
   */
  const checkDisconnectStatus = async(order) => { //TODO: merge all the checkStatus functions.
    let orderStatus
    for await (_ of [...Array(10).keys()]) {
      orderStatus = (await numbers.Disconnect.getAsync(order.id, {tnDetail:false}).catch((err) => {
        if (err.status) {
          throw new ApiError(err);
        }
      }));
      if (orderStatus) {
        return orderStatus;
      }
      await sleep(250);
    }
    return null;
  }
  
  /**
   * Force deleting a peer will do the following in order:
   * 1. Delete port orders
   * 2. Disconnect or move all numbesr
   * 3. Remove linked applications.
   * 4. Remove mms settings
   * 5. remove sms settings
   * 6. convrt to SIP
   * 7. Delete location.
   * only step 7 will be carried out if force delete is off.
   */
  const delPeer = async(peer, force, verbose=false) => {
    if (force) {
      const tns = await peer.getTnsAsync().then((res) =>(res?res.map(entry => entry.fullNumber):null))
      .catch((err) => {throw new ApiError(err)});
      if (tns) {
        const deleteOrder = await numbers.Disconnect.createAsync("Disconnect Order", tns)
          .catch((err) => {throw new ApiError(err)});
        if (!(await checkDisconnectStatus(deleteOrder.orderRequest))) {
          throw new CliError('No confirmation after placing phone number disconnect order.')
        }
        printer.printIf(verbose, `Phone numbers associated with sip peer ${peer.id} have been disconnected`);
      }
      await peer.removeApplicationAsync().catch((err) => {throw new ApiError(err)});
      printer.printIf(verbose, `Application unlinked from sip peer ${peer.id}`)
      await peer.deleteMmsSettingsAsync()
        .then(()=> {printer.printIf(verbose, `MMS deleted from sip peer ${peer.id}`);})
        .catch((err) => {
          if (err.status === 404) {
            return; //no mms settings found, nothing to delete.
          }
          throw new ApiError(err)
        });
      await peer.deleteSmsSettingsAsync()
        .then(()=> {printer.printIf(verbose, `SMS deleted from sip peer ${peer.id}`);})
        .catch((err) => {
        if (err.status === 404) {
          return;
        }
        throw new ApiError(err)
      });
    }
    await peer.deleteAsync().catch((err) => {throw new ApiError(err)});
    printer.warn(`Sip peer ${peer.id} deleted.`);
  }
  
  const delApp = async (app, force, verbose=false) => {
    const associatedSipPeers = await app.getSipPeersAsync().catch((err) => {throw new ApiError(err)});
    if (force && associatedSipPeers) {
      for await (sipPeerData of associatedSipPeers) {
        let peer = new numbers.SipPeer();
        peer.id = sipPeerData.peerId;
        peer.siteId = sipPeerData.siteId;
        peer.client = new numbers.Client();
        await peer.removeApplicationAsync().catch((err) => {throw new ApiError(err)});
        printer.printIf(verbose, `Unlinking your application ${app.applicationId} with Sip Peer ${peer.id}`); //TODO add ___If function to printer and make this warnIf
      }
      printer.print();
    }
    await app.deleteAsync().catch((err) => {throw new ApiError(err)});
  }
  
  
  const delSite = async(site, force, verbose=false) => {
    if (force) {
      const associatedSipPeers = await site.getSipPeersAsync().catch((err) => {throw new ApiError(err)});
      associatedSipPeers.sort((peerA, peerB) => peerA.isDefaultPeer - peerB.isDefaultPeer)//delete default peer last
      for await (sipPeer of associatedSipPeers) {
        await delPeer(sipPeer, force, verbose) //Rewrite with Promise.all if speed becomes an issue.
      }
    }
    await site.deleteAsync().catch((err) => {throw new ApiError(err)});
  }
  
  module.exports = {
    placeNumberOrder,
    placeCategoryOrder,
    delApp,
    delSite,
    delPeer
  }