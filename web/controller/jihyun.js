const express = require("express");
const Dining = require("../models/dining");
const Keyword = require("../models/keyword");

// 'score' query string 파싱
const getScore = (score) => {
  if (score == "total") {
    return "totalScore";
  } else if (score == "taste") {
    return "tasteScore";
  } else if (score == "price") {
    return "priceScore";
  } else if (score == "service") {
    return "serviceScore";
  } else if (score == "mood") {
    return "moodScore";
  }
};

// page offset 계산
const getOffset = (page, user) => {
  const limit = 5;
  let offset = 0;
  let totalNum = 0;

  if (user) {
    // /user/like
    try {
      totalNum = user.getDinings.count();
    } catch (err) {
      console.error(err);
      return next(err);
    }
  } else {
    // /dining
    try {
      totalNum = Dining.count();
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  // 마지막 페이지 계산
  const lastPage = Math.ceil(totalNum / limit);

  // offset 계산
  if (page) {
    const pageNum = parseInt(page);
    if (pageNum > lastPage) {
      offset = (lastPage - 1) * limit;
    } else {
      offset = (pageNum - 1) * limit;
    }
  }
  return offset;
};

// /dining
exports.getDining = (req, res, next) => {
  const offset = getOffset(req.query.page, undefined);
  const score = getScore(req.query.score);
  const keyword = req.query.keyword;
  let dinings;

  try {
    if (keyword) {
      dinings = Dining.findAll({
        include: {
          model: Keyword,
          where: { name: keyword },
        },
        order: [[score, "DESC"]],
        limit: 5,
        offset: offset,
      });
    } else {
      dinings = Dining.findAll({
        include: { model: Keyword },
        order: [[score, "DESC"]],
        limit: 5,
        offset: offset,
      });
    }
    res.json(dinings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// /user/like
exports.getUserLike = (req, res, next) => {
  const score = getScore(req.query.score);

  try {
    const user = User.findOne({ where: { id: req.user.id } });
    if (user) {
      const offset = getOffset(req.query.page, user);
      const dinings = user.getDinings({
        include: { model: Keyword },
        order: [[score, "DESC"]],
        limit: 5,
        offset: offset,
      });
      res.json(dinings);
    } else {
      res.status(404).send("사용자가 존재하지 않습니다.");
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
