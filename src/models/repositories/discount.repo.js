'use strict'

const findAllDiscountCodesUnSelect = async ({
    limit = 50 , page = 1, sort = 'ctime',
    filter, unSelect, model
})=>
{
    const skip = (page -1)*limit
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id : 1}
    const products = await model.find(filter)
    .sort(sorBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean()

    return products
}

modules.export ={
    findAllDiscountCodesUnSelect
}