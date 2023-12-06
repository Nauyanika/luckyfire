"use strict";
const express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const conn = require("./config/db");
var nodemailer = require("nodemailer");
const moment = require("moment");
const bcrypt = require("bcrypt");
const axios = require('axios');




//const { PaymentGateway } = require('@cashfreepayments/cashfree-sdk');

const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
const path = require("path");

const AuthRoute = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use("/apkurl", express.static("APK"));


app.use("/auth", AuthRoute);
app.use("/user", UserRoutes);

 
 
 
 
 
 
 
app.get("/servertesting", (req, res) => {
  res.sendFile(path.join(__dirname + "/test.html"));
});

app.get("/test", (req, res) => {
  res.send("test");
});





app.get('/',(req,res)=>{
  res.send("hello world")
})



app.post('/player',async(req,res)=>{
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    let sql = "INSERT INTO player_game_history SET ?";
    let formData1 = {
      
      
      playerid: req.body.playerid,
      game_score: req.body.game_score,
      player_result: req.body.player_result,
      gameid: req.body.gameid,

    };
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = " updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error--",error)
    res.status(500).send("Database error");
    
  }

})

























 






app.get('/playerOnline',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT playerid FROM playeronline WHERE player_online=1`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     /*  data={
      //Playerid:playerid,
      Player_online:agent[0].player_online
     } */
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


// Start Api--------------------------------------------------------------------------------------------------------------------
//first API










// app.post('/dashboardlogin',async(req,res)=>{

//   let message = null;
//   let statusCode = 400;
//   let error = {};
//   console.log(req.body);

//   let data = {};

//   try {
//     const { email, password } = req.body;
//     let sql = `SELECT * FROM users WHERE LOWER(users.useremail)= ? `;
//     let user = await conn.query(sql, [email.toLowerCase()]);
//     if (user.length > 0) {
//       const usersRows = JSON.parse(JSON.stringify(user))[0];
//       const comparison = await bcrypt.compare(password, usersRows.password);
//       if (comparison) {
//         const last_login = moment().format("YYYY-MM-DD HH:mm:ss");
//         statusCode = 200;
//         message = "Login success";

//         data = {
          
//           balance: usersRows.point,
//           user_id: usersRows.user_id,

//           login: true,
//           profile: {
//             email: usersRows.useremail,
//              },
//           username: usersRows.username,
//         };

//       } else {
//         statusCode = 401;
//         message = "Password does not match!";
//       }
//     } else {
//       statusCode = 401;
//       message = "Password or email does not match!";
//     }
//     const responseData = {
//       status: statusCode,
//       message,
//       user: data,
//       errors: error,
//       token:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJyb2xlX2lkIjoxLCJhZG1pbl9pZCI6MSwiaWF0IjoxNjUzMTMwNDMwLCJleHAiOjE2NTMxMzQwMzB9.hU41Zvx5uoaI7Nt46LaL8GFjTjAXUnet6GKhc5Ku4TA",
//     };
//     res.send(responseData);
//   } catch (error) {
//     console.log(error);
//     res.send({ authLogin: error });
//   }})
 

app.post('/dashboardlogin', async (req, res) => {
  let message = null;
  let statusCode = 400;
  let error = {};
  console.log(req.body);

  let data = {};

  try {
    const { email, password } = req.body;
    let sqlUsers = `SELECT * FROM users WHERE LOWER(users.useremail) = ?`;
    let sqlAgents = `SELECT * FROM agents WHERE LOWER(agents.agent_email) = ?`;

    let user = await conn.query(sqlUsers, [email.toLowerCase()]);
    let agent = await conn.query(sqlAgents, [email.toLowerCase()]);

    if (user.length > 0) {
      const usersRows = JSON.parse(JSON.stringify(user))[0];
      const comparison = await bcrypt.compare(password, usersRows.password);
      if (comparison) {
        const last_login = moment().format("YYYY-MM-DD HH:mm:ss");
        statusCode = 200;
        message = "User Login success";

        data = {
          balance: usersRows.point,
          user_id: usersRows.user_id,
          login: true,
          profile: {
            email: usersRows.useremail,
          },
          username: usersRows.username,
        };
      } else {
        statusCode = 401;
        message = "Password does not match!";
      }
    } else if (agent.length > 0) {
      statusCode = 200;
      message = "Agent Login success";
    } else {
      statusCode = 401;
      message = "Password or email does not match!";
    }

    const responseData = {
      status: statusCode,
      message,
      user: data,
      email:email,
      errors: error,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJyb2xlX2lkIjoxLCJhZG1pbl9pZCI6MSwiaWF0IjoxNjUzMTMwNDMwLCJleHAiOjE2NTMxMzQwMzB9.hU41Zvx5uoaI7Nt46LaL8GFjTjAXUnet6GKhc5Ku4TA",
    };

    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.send({ authLogin: error });
  }
});


































// Second API-----------------------------------------------------------------------------------------------------------------------







app.post('/authSignUp', async (req, res) => {
  let message = null
  let register = false

  let statusCode = 400  
  try {
  
      const {username,email,password} = req.body

      const encryptedPassword = await bcrypt.hash(password, 10) 
          const formData = { 
              username:username,
              email   : email,
              password: encryptedPassword
          };
          
              // Check requeted user is exist or not
              let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
              let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
              if (user.length > 0) {
                  statusCode  = 401
                  message     = 'Sorry! Email already exist try another email' 
              } else { 
                 const sql1  = `INSERT INTO users set ?`;
                 const users = await conn.query(sql1, formData)
                  if(users){
                      statusCode = 201
                      message = "User created success"
                      register=true
                  }else{
                      statusCode = 500
                      message = "Something went wrong! database error"
                  } 
              }
          
          const responseData = {
              status: statusCode,
              message, 
              register,

          }
          res.send(responseData)
      
  } catch (error) {
      res.send({ error: error })
  }
}

)


























app.post('/authLogin',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let error = {};
  console.log(req.body);

  let data = {};

  try {
    //    Check requeted user is exist or not
    const { userid, password } = req.body;
    let sql = `SELECT * FROM users WHERE LOWER(users.userid)= ? `;
    let user = await conn.query(sql, [userid.toLowerCase()]);
    if (user.length > 0) {
      const usersRows = JSON.parse(JSON.stringify(user))[0];
      const comparison = await bcrypt.compare(password, usersRows.password);
      if (comparison) {
        const last_login = moment().format("YYYY-MM-DD HH:mm:ss");
        statusCode = 200;
        message = "Login success";

        data = {
          //   user_id:1,role_id:1,role_name:"Super Admin",
          credits: usersRows.point,
         // user_id: usersRows.user_id,

          login: true,
          /* profile: {
            firstname: usersRows.first_name,
            lastname: usersRows.last_name,
            userid: usersRows.userid,
            //phone:usersRows.phone,
            refercode: usersRows.refer_code,

            cashbalance: usersRows.cash_balance,
            safe_balance: usersRows.safe_balance,
            winning_balance: usersRows.winning_balance,
            bonus_amount: usersRows.bonus_amount,
            coin_balance: usersRows.coin_balance,
          },
           *///username: usersRows.username,
        };

        /*  let auth ={
                        id: usersRows.admin_id,
                        user_id: usersRows.admin_id,
                        role_id :usersRows.role_id,
                        role_name :usersRows.name,  
                    } */
        //  const tokens = await authToken(auth);
        //token = tokens
      } else {
        statusCode = 401;
        message = "Password does not match!";
      }
    } else {
      statusCode = 401;
      message = "Password or userid does not match!";
    }
    const responseData = {
      status: statusCode,
      message,
      user: data,
      //errors: error,
      //token:
      //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJyb2xlX2lkIjoxLCJhZG1pbl9pZCI6MSwiaWF0IjoxNjUzMTMwNDMwLCJleHAiOjE2NTMxMzQwMzB9.hU41Zvx5uoaI7Nt46LaL8GFjTjAXUnet6GKhc5Ku4TA",
    };
    res.send(responseData);
  } catch (error) {
    console.log(error);
    res.send({ authLogin: error });
  }
}
);


























app.get('/payout',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM payout `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);



app.get('/counter',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM counter `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);





app.get('/sound',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM sound `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


app.get('/screen',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM screen `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);






app.get('/totaldata',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT * FROM total_data `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


app.get('/data',async (req, res) => {
  let message = null;
  let statusCode = 400;
  let data;
  try {
    let sql = `SELECT id,total_in,total_out,percentage  FROM total_data `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
     
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error------",error)
    res.status(500).send("Database error");
  }
}
);


app.post( '/data', async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let data;
  try {
    let sql = "INSERT INTO total_data SET ?";
    let formData1 = {
      id: req.body.id,
    total_in: req.body.total_in,
      total_out: req.body.total_out,
      percentage: req.body.percentage,
    };

    const userss = await conn.query(sql, formData1);
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = "data updated";
      data=userss;
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
      data:data.userss,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error-------------",error)
    res.status(500).send("Database error");
  }
})







app.post( '/screen', async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let data;
  try {
    let sql = "INSERT INTO screen SET ?";
    let formData1 = {
      id: req.body.id,
    color: req.body.total_in,
      allwhite: req.body.total_out,
      percentage: req.body.percentage,
    };

    const userss = await conn.query(sql, formData1);
    let statusCode = 200;
    let message = "";
    if (userss) {
      statusCode = 200;
      message = "data updated";
      data=userss;
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }
    const responseDatajson = {
      status: statusCode,
      message,
      data:data.userss,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error-------------",error)
    res.status(500).send("Database error");
  }
})






app.get('/download',(req,res)=>{
  res.send(`<a href='/servertesting>click here this downloadlink</a>`)
})




http.listen(PORT, () => {
  ("listening on " + PORT);
});
