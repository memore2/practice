import Video from "../models/Video";

//HOME
export const home = async (req, res) => {
  const videos = await Video.find();
  return res.render("home", { pageTitle: "HOME", videos });
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
  } = req;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch {
    return res.status(400).render("upload", {
      pageTitle: "Upload",
      errorMessage: "모든 정보를 입력하세요.",
    });
  }
};

export const search = async (req, res) => {
  const {
    query: { keyword },
  } = req;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
//VIDEO
export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.send("Not Video");
  }

  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).redirect("/");
  }
  return res.render("videos/edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
  const {
    body: { title, description, hashtags },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).send("없는 비디오");
  }
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${video.id}`);
  } catch (error) {
    return res.status(400).render("videos/edit", {
      pageTitle: video.title,
      video,
      errorMessage: "모든 정보를 입력하세요",
    });
  }
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
  } catch {
    return res.status(400).send("없는 비디오");
  }
};
