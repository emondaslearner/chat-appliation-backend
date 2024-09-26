const { updateUser: updateUserLib } = require("@lib/v1/user");

const updateUser = async (req, res, next) => {
  try {
    const profile_picture = req.files?.profile_picture?.[0];
    const cover_picture = req.files?.cover_picture?.[0];

    const data = {
      dateOfBirth: req.body.dateOfBirth,
      name: req.body.name,
      email: req.body.email,
      date_of_birth: req.body.dateOfBirth,
      bio: req.body.bio,
      status: req.body.status,
      locked: req.body?.locked,
      profile_picture,
      cover_picture,
      address: {
        city: req.body.city,
        country: req.body.country,
      },
    };

    const updatedData = await updateUserLib({ id: req.user.id, data });

    const responseData = {
      code: 200,
      message: "User updated successfully",
      data: updatedData,
      self: req.url,
      links: {
        user: `/user/${updatedData._id}`,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = updateUser;
