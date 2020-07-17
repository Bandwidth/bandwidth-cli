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
    await checkOrderStatus(createdOrder);
  }
  
  /**
   * Continuously checks the status of the order until the order is complete, or
   * until 10 attempts have been made with no response.
   */
  const checkOrderStatus = async(order) => {
    let orderStatus
    for await (areaCode of [...Array(10).keys()]) {
      orderStatus = (await order.getHistoryAsync()).pop();
      if (orderStatus) {
        delete orderStatus.author
        const tns = await order.getTnsAsync();
        orderStatus.telephoneNumbers = tns.telephoneNumber
        printer.removeClient(orderStatus);
        break;
      }
    }
  }

  module.exports = {
    placeNumberOrder,
    placeCategoryOrder
  }