const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';
const TOKEN_EXPIRATION = '30d';

const authController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      await User.update({ refreshToken: token }, { where: { id: newUser.id } });

      res.status(201).json({ message: 'Usuario registrado exitosamente', token, userId: newUser.id });
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    const { identifier, password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: identifier }, { name: identifier }],
        },
      });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      await User.update({ refreshToken: token }, { where: { id: user.id } });

      res.json({ token, userId: user.id });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  verifyToken: async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findOne({ where: { id: decoded.id, refreshToken: token } });
      if (!user) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401).json({ message: 'Token inválido o expirado' });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      await User.destroy({ where: { id: userId } });
      res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

module.exports = authController;