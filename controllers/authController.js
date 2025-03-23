import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';

// Registriert einen neuen Benutzer
export const register = async (req, res) => {
  // Prüft, ob dies der erste Benutzer ist
  const isFirstAccount = (await User.countDocuments()) === 0;
  // Setzt die Rolle basierend darauf - erster Benutzer wird Admin, alle anderen sind normale Benutzer
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  // Erstellt den Benutzer in der Datenbank
  const user = await User.create(req.body);
  // Sendet Erfolgsantwort mit Status 201 (Created) und den Benutzerdaten
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};

export const login = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  const isValidUser = user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

  const token = createJWT({ userId: user._id, role: user.role });
  console.log(token);

  res.send({token});
};