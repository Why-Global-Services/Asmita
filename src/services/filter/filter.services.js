const { filter } = require("../../models/filter.model");



const createFilter = async(req)=>{
    const {body} = req;

    const filterData = await filter.create({...body})

    return {
        success: true,
        message: "Filter Created Successfully",
        data: filterData
    }
}

const getFilter = async(req)=>{
    const filterData = await filter.find();

    return {
        success: true,
        message: "Filters fetched successfully",
        data: filterData
    }
}


const updateFilter = async(req)=>{

     const {body} = req;

     const {id} = req.params;

    const filterData = await filter.findByIdAndUpdate(id, {...body}, {new: true})

    return {
        success: true,
        message: "Filter Updated successfully",
        data: filterData
    }


}

const deleteFilter = async (req)=>{
    const {id} = req.params;

    const filterData = await filter.findByIdAndDelete(id)

    return {
        success: true,
        message: "Filter deleted successfully",
        data: filterData
    }
}


module.exports = {
    createFilter,
    getFilter,
    updateFilter,
    deleteFilter
}