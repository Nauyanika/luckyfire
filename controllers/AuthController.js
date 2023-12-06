const bcrypt = require("bcrypt");
// const check = require('../validation/CheckValidation')
const conn = require("../config/db");
const moment = require("moment");
//const { authToken } = require("../middleware/getToken");
//User login
// var nodemailer = require("nodemailer");
const express = require("express");





const authLogin = async (req, res) => {
  const { user_id, password } = req.body;

  const checkUserQuery = `SELECT * FROM users WHERE user_id = '${user_id}'`;

  conn.query(checkUserQuery, (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      res.status(500).json({ status: 500, message: 'Error checking user' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }

    const user = result[0];
    const phoneAdded = user.phone_number !== null;
    const loginSuccess = user.password === password;

    if (loginSuccess) {
      res.status(200).json({
        status: 200,
        message: 'Login success',
        user: {
          credits: user.point,
          phone_number: user.phone_number,
          login: true,
          phone_number_added: phoneAdded
        }
      });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Invalid password',
        user: {
          credits: 0,
          phone_number: 0,
          login: false,
          phone_number_added: false
        }
      });
    }
  });
};








const authFetchGameSetting = async (req, res) => {
  const fetchGameSettingsQuery = 'SELECT basket_speed, ball_size, ball_bounciness, ball_speed, ball_weight, combination_difficulty FROM settings';

  conn.query(fetchGameSettingsQuery, (err, result) => {
    if (err) {
      console.error('Error fetching game settings:', err);
      res.status(500).json({ status: 500, message: 'Error fetching game settings' });
      return;
    }

    const gameSettings = result.length > 0 ? result[0] : null;

    res.status(200).json({ status: 200, message: 'Settings fetched', data: gameSettings });
  });
};





const adduserbyadmin = async (req, res) => {
  let message = null;
  let register = false;

  let statusCode = 400;
  try {
   // const { user_id, password } = req.body;
    const { user_id,agent_email, agent_phoneNumber,password } = req.body;


    const encryptedPassword = password;
    const formData = {
      user_id: user_id,
      agent_email:agent_email,
      agent_phoneNumber:agent_phoneNumber,
      password: encryptedPassword,
      role_id: 0,
    };

    // Check if the requested user already exists
    let sql = `SELECT * FROM users WHERE user_id = ? AND role_id = 0 LIMIT ?`;
    let user = await conn.query(sql, [formData.user_id, 1]);
    if (user.length > 0) {
      statusCode = 201;
      message = 'Sorry! Username already exists, try another username';
    } else {
      const sql1 = `INSERT INTO users SET ?`;
      const users = await conn.query(sql1, formData);
      if (users) {
        statusCode = 200;
        message = "User created successfully";
        register = true;
      } else {
        statusCode = 500;
        message = "Something went wrong! Database error";
      }
    }

    const responseData = {
      status: statusCode,
      message,
      register,
    };
    res.send(responseData);
  } catch (error) {
    res.send({ error: error });
  }
};

// const addagentbyadmin = async (req, res) => {
//   let message = null;
//   let register = false;

//   let statusCode = 400;
//   try {
//     const { agent_name, agent_phoneNumber, password } = req.body;

//     const formData = {
//       agent_name: agent_name,
//       agent_phoneNumber: agent_phoneNumber,
//       password: password,
//     };

//     // Check if the requested agent already exists
//     let sql = 'SELECT * FROM agents WHERE agent_name = ? LIMIT ?';
//     let agent = await conn.query(sql, [formData.agent_name, 1]);

//     if (agent.length > 0) {
//       statusCode = 201;
//       message = 'Sorry! Agent already exists, try another agent name';
//     } else {
//       const sql1 = 'INSERT INTO agents SET ?';
//       const result = await conn.query(sql1, formData);

//       if (result) {
//         statusCode = 200;
//         message = 'Agent created successfully';
//         register = true;
//       } else {
//         statusCode = 500;
//         message = 'Something went wrong! Database error';
//       }
//     }

//     const responseData = {
//       status: statusCode,
//       message,
//       register,
//     };
//     res.send(responseData);
//   } catch (error) {
//     res.send({ error: error });
//   }
// };

const addagentbyadmin = async (req, res) => {
  let message = null;
  let register = false;

  let statusCode = 400;
  try {
    const { agent_name, agent_phoneNumber, password, agent_email } = req.body;

    const formData = {
      agent_name: agent_name,
      agent_phoneNumber: agent_phoneNumber,
      password: password,
      agent_email: agent_email, // Added agent_email field
    };

    // Check if the requested agent already exists
    let sql = 'SELECT * FROM agents WHERE agent_name = ? LIMIT ?';
    let agent = await conn.query(sql, [formData.agent_name, 1]);

    if (agent.length > 0) {
      statusCode = 201;
      message = 'Sorry! Agent already exists, try another agent name';
    } else {
      const sql1 = 'INSERT INTO agents SET ?';
      const result = await conn.query(sql1, formData);

      if (result) {
        statusCode = 200;
        message = 'Agent created successfully';
        register = true;
      } else {
        statusCode = 500;
        message = 'Something went wrong! Database error';
      }
    }

    const responseData = {
      status: statusCode,
      message,
      register,
    };
    res.send(responseData);
  } catch (error) {
    res.send({ error: error });
  }
};



const setBallSettings = async (req, res) => {
  const { basket_speed, ball_size, ball_bounciness, ball_speed, ball_weight, combination_difficulty } = req.body;

  const updateSettingsQuery = `UPDATE settings SET 
    basket_speed = '${basket_speed}',
    ball_size = '${ball_size}',
    ball_bounciness = '${ball_bounciness}',
    ball_speed = '${ball_speed}',
    ball_weight = '${ball_weight}',
    combination_difficulty = '${combination_difficulty}'
  `;

  conn.query(updateSettingsQuery, (err, result) => {
    if (err) {
      console.error('Error updating ball settings:', err);
      res.status(500).json({ status: 500, message: 'Error updating ball settings' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Ball settings updated successfully' });
  });
};



const addAdminContact = async (req, res) => {
  const { agent_phoneNumber, whatsapp_number, email } = req.body;

  const updateContactQuery = `update admin_contact SET 
    agent_phoneNumber = '${agent_phoneNumber}',
    whatsapp_number = '${whatsapp_number}',
    email = '${email}'
  `;

  conn.query(updateContactQuery, (err, result) => {
    if (err) {
      console.error('Error updating admin contact:', err);
      res.status(500).json({ status: 500, message: 'Error updating admin contact' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Admin contact updated successfully' });
  });
};








module.exports = {
  authLogin,
  authFetchGameSetting,
  adduserbyadmin,
  setBallSettings,
  addAdminContact,
  addagentbyadmin
};

