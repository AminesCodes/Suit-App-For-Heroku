/*
Posts Route Helper Functions | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


const processInput = (req, location) => {
  switch (location) {
    case "offset":
      if (!req.query.offset || !req.query.offset.trim()) {
        return 0;
      }
      if (isNaN(parseInt(req.query.offset.trim()))) {
        throw new Error("400__error: invalid offset parameter");
      }
      return parseInt(req.query.offset.trim());

    case "userId":
      if (!req.params.id || !req.params.id.trim() || isNaN(parseInt(req.params.id))) {
        throw new Error("400__error: invalid user_id parameter");
      }
      return parseInt(req.params.id);

    case "search hashtags":
      if (!req.query.hashtags || !req.query.hashtags.trim()) {
        throw new Error("400__error: empty hashtags parameter");
      }
      const hashtagsInput = req.query.hashtags.trim();
      let hashtagsArr = hashtagsInput.replace(/[^a-zA-Z0-9 ]/g, "").split(" ");
      const formattedHashtagsArr = hashtagsArr.map(tag => `%#${tag}#%`);
      return ({
          parsed: hashtagsArr.join(', '),
          formatted: formattedHashtagsArr
      });

    case "postId":
      if (!req.params.postId || !req.params.postId.trim() || isNaN(parseInt(req.params.postId))) {
        throw new Error("400__error: invalid post_id parameter");
      }
      return parseInt(req.params.postId);

    case "currUserId":
      if (!req.body.currUserId || isNaN(parseInt(req.body.currUserId))) {
        throw new Error("400__error: invalid parsed current user id");
      }
      return parseInt(req.body.currUserId);

    case "password":
      if (!req.body.password || !req.body.password.trim()) {
        throw new Error("401__error: invalid password");
      }
      return req.body.password.trim();

    case "imageUrl":
      if (!req.file) {
        throw new Error("400__error: missing image file");
      }
      return "http://" + req.headers.host + "/images/posts/" + req.file.filename;

    case "caption":
      if (!req.body.caption || !req.body.caption.trim()) {
        return ({
            caption: '',
            formattedHashtags: ''
        });
      }
      const caption = req.body.caption.trim();
      let words = caption.replace(/[^a-zA-Z0-9 #]/g, "").split(' ');
      let hashtags = words.filter(word => word[0] === '#');
      // filter out multiple #s in a row
      hashtags = hashtags
        .map(hashtag => hashtag.replace(/[#]/g, ""))
        .filter(hashtag => !!hashtag);
      const formattedHashtags = hashtags.length ? "#" + hashtags.join('#') + "#" : null;
      return ({
          caption,
          formattedHashtags
      });

      case "title":
      if (!req.body.title || !req.body.title.trim()) {
        return ''
      }
      return req.body.title.trim()

    default:
      throw new Error("500__error: you're not supposed to be here.");
  }
}


module.exports = {
  processInput
}
