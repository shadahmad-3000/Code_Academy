import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_LASTNAME, ADMIN_PASSWORD } from "../config.js";
import bcrypt from "bcryptjs";

export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "1" }).save(),
      new Role({ name: "2" }).save(),
      new Role({ name: "3" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

export const createAdmin = async () => {
  try {
    // Check if an administrator user already exists
    const userFound = await User.findOne({ email: ADMIN_EMAIL });
    if (userFound) return;

    // Get the roles
    const roles = await Role.find({ name: { $in: ["1", "2", "3"] } });

    // Check if roles were found
    if (roles.length === 0) {
      console.error('No se encontraron roles.');
      return;
    }

    // Generate the password hash
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create the new administrator user with the assigned roles
    const newUser = await User.create({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      verified: true,
      lastname: ADMIN_LASTNAME,
      password: passwordHash,
      roles: roles.map((role) => role._id), // Assign role IDs to the new user
    });

    console.log(`Nuevo usuario creado:`, newUser);
  } catch (error) {
    console.error(error);
  }
};

createRoles();
createAdmin();
