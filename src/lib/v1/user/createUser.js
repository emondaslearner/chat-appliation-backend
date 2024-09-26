const { error } = require("@utils");
const User = require("@models/User");
const { hash } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const createUser = async ({ name, email, password, dateOfBirth }) => {
  // check all information provided correctly or not
  if (!name || !email || !password || !dateOfBirth) {
    throw error.badRequest(
      `${!name && "name:name is empty"}|${!email && "email:email is empty"}|${
        !password && "password:password is empty"
      }|${!dateOfBirth && "dateOfBirth:dateOfBirth is empty"}`
    );
  }

  // check data is correct or not
  const date = new Date(dateOfBirth);
  if (isNaN(date.getTime())) {
    throw error.badRequest("dateOfBirth:dateOfBirth is not a valid date");
  }

  // check email already exist or not
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw error.badRequest("email:email already exist");
  }

  // hash password
  const hashedPassword = await hash.generateHash(password);

  // create user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    date_of_birth: date,
  });

  const data = await user.save();

  deleteKeysWithPrefix("users:");

  return data;
};

module.exports = createUser;
