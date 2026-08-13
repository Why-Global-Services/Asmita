const { contact } = require("../../models/contact.model");
const ApiError = require("../../utils/apiError");

const createContactUs = async(req)=>{
    const {body} = req;


    if(!body.name && !body.phoneNumber && !body.email){
        throw new ApiError(400, "Provide all details")
    }

    const createdContact = await contact.create(body)

    return {success: true, message: "Contact created successfully", data: createdContact}
};

const getContact = async (req) => {
  if (req.user.role !== "superAdmin" && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized");
  }

  const fetchedContact = await contact.find();

  if (fetchedContact.length === 0) {
    throw new ApiError(404, "No contact found");
  }

  return {
    success: true,
    message: "Contact fetched successfully",
    data: fetchedContact,
  };
};


module.exports = {
    createContactUs,
    getContact
}