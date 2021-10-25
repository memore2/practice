import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

//HOME
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const {
    body: { username, email, name, password, password2, location },
  } = req;
  const user = await User.exists({ $or: [{ username }, { email }] });
  if (user) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "이미 존재하는 아이디/email입니다.",
    });
  }
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "비밀번호가 서로 다릅니다.",
    });
  }
  await User.create({
    username,
    email,
    name,
    password,
    location,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "존재하지 않는 아이디입니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "비밀번호가 맞지 않습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();

  return res.redirect("/");
};
//USER

export const githubLoginStart = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finishUrl = `${baseUrl}?${params}`;
  return res.redirect(finishUrl);
};
export const githubLoginfinish = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finishUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finishUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const tokenUrl = "https://api.github.com/user";
    const userData = await (
      await fetch(tokenUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${tokenUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailColander = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailColander) {
      return res.status(400).redirect("/");
    }
    const ok = await User.findOne({ email: emailColander.email });
    if (ok) {
      req.session.loggedIn = true;
      req.session.user = ok;
      return res.redirect("/");
    }
    const user = await User.create({
      username: userData.login,
      avatarUrl: userData.avatar_url,
      email: emailColander.email,
      socialOnly: true,
      name: userData.name,
      password: "",
      location: userData.location,
    });
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  }
};

export const getEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findOne({ _id });
  return res.render("users/edit", { pageTitle: "Edit Profile", user });
};

export const postEdit = async (req, res) => {
  const {
    session: { user },
    body: { username, email, name, location },
  } = req;
  const userData = await User.findOne({ $or: [{ email }, { username }] });

  const userArticle = await User.exists({ $or: [{ username }, { email }] });
  console.log(userData);
  try {
    if (!userArticle || userData) {
      const newUser = await User.findByIdAndUpdate(
        user._id,
        {
          username,
          email,
          name,
          location,
        },
        { new: true }
      );
      req.session.user = newUser;
      return res.redirect("/users/edit");
    }
  } catch {
    return res.status(400).render("users/edit", {
      pageTitle: "Edit Profile",
      errorMessage: "존재하는 email/아이디입니다.",
      user,
    });
  }
};

export const getEditPassword = (req, res) => {
  return res.render("users/edit-password", { pageTitle: "Edit Password" });
};
export const postEditPassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldpassword, newpassword, newpassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldpassword, user.password);
  if (!ok) {
    return res.status(400).render("users/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: "비빌번호가 다릅니다.",
    });
  }
  if (newpassword !== newpassword2) {
    return res.status(400).render("users/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: "새로운 비빌번호가 서로 다릅니다.",
    });
  }
  user.password = newpassword;
  user.save();
  return res.redirect("/logout");
};
