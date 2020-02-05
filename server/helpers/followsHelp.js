/*
Follows Route Helper Functions | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


const processInput = (req, location) => {
  switch (location) {
    case "currUserId":
      if (!req.params.currUserId || isNaN(parseInt(req.params.currUserId))) {
        throw new Error("400__error: invalid current user_id parameter");
      }
      return parseInt(req.params.currUserId);

    case "targetUserId":
      if (!req.params.targetUserId || isNaN(parseInt(req.params.targetUserId))) {
        throw new Error("400__error: invalid target user_id parameter");
      }
      return parseInt(req.params.targetUserId);

    case "password":
      if (!req.body.password || !req.body.password.trim()) {
        throw new Error("401__error: invalid password");
      }
      return req.body.password.trim();

    default:
      throw new Error("500__error: you're not supposed to be here.");
  }
}

const handleSuccess = (res, resultArray, currUserId, dataName) => {
  res.json({
    status: "success",
    message: `${dataName} of user ${currUserId} retrieved`,
    payload: resultArray
  });
}


module.exports = {
  processInput,
  handleSuccess
}
