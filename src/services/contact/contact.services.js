const { contact } = require("../../models/contact.model");
const ApiError = require("../../utils/apiError");

const isAdminRole = (role) => {
  const r = (role || "").toLowerCase();
  return r === "superadmin" || r === "admin";
};

const createContactUs = async(req)=>{
    const {body} = req;


    if(!body.name && !body.phoneNumber && !body.email){
        throw new ApiError(400, "Provide all details")
    }

    const createdContact = await contact.create(body)

    return {success: true, message: "Contact created successfully", data: createdContact}
};

const getContact = async (req) => {
  if (!isAdminRole(req.user?.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const fetchedContact = await contact.find();

  return {
    success: true,
    message: "Contact fetched successfully",
    data: fetchedContact || [],
  };
};


module.exports = {
    createContactUs,
    getContact
}