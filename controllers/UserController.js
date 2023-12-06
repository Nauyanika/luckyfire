const bcrypt = require("bcrypt");
//const check = require('../validation/CheckValidation')
const conn = require("../config/db");
const moment = require("moment");






const deductCredits = async (req, res) => {
  const { user_id, deductAmount } = req.body;

  // Fetch current credits for the user
  const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;

  conn.query(fetchCreditsQuery, (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      res.status(500).json({ status: 500, message: 'Error fetching credits' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }

    const currentCredits = result[0].point;
    const updatedCredits = currentCredits - deductAmount;
    const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;

    conn.query(updateCreditsQuery, (err) => {
      if (err) {
        console.error('Error updating credits:', err);
        res.status(500).json({ status: 500, message: 'Error updating credits' });
        return;
      }

      res.status(200).json({ status: 200, message: 'Credits deducted and fetched updated credits', credits: updatedCredits });
    });
  });
};

const debitPoints = async (req, res) => {
  const { user_id, deductAmount } = req.body;

  // Fetch current credits for the user
  const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;

  conn.query(fetchCreditsQuery, (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      res.status(500).json({ status: 500, message: 'Error fetching credits' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }

    const currentCredits = result[0].point;

    if (deductAmount > currentCredits) {
      res.status(400).json({ status: 400, message: 'Insufficient credits' });
      return;
    }

    const updatedCredits = currentCredits - deductAmount;
    const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;

    conn.query(updateCreditsQuery, (err) => {
      if (err) {
        console.error('Error updating credits:', err);
        res.status(500).json({ status: 500, message: 'Error updating credits' });
        return;
      }

      res.status(200).json({ status: 200, message: 'Credits deducted and fetched updated credits', credits: updatedCredits });
    });

    const insertDebitedQuery = `INSERT INTO points_debited (user_id, point_debited) VALUES ('${user_id}', ${deductAmount})`;
    conn.query(insertDebitedQuery, (err) => {
      if (err) {
        console.error('Error inserting debited credits:', err);
        res.status(500).json({ status: 500, message: 'Error inserting debited credits' });
        return;
      }
    });
  });
};



// const deductCredits = async (req, res) => {
//   const { user_id, deductAmount } = req.body;

//   // Fetch current credits for the user
//   const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;

//   conn.query(fetchCreditsQuery, (err, result) => {
//     if (err) {
//       console.error('Error fetching credits:', err);
//       res.status(500).json({ status: 500, message: 'Error fetching credits' });
//       return;
//     }

//     // Check if user exists
//     if (result.length === 0) {
//       res.status(404).json({ status: 404, message: 'User not found' });
//       return;
//     }

//     const currentCredits = result[0].point;
//     const updatedCredits = currentCredits - deductAmount;

//     // Update credits in the database
//     const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;

//     conn.query(updateCreditsQuery, (err) => {
//       if (err) {
//         console.error('Error updating credits:', err);
//         res.status(500).json({ status: 500, message: 'Error updating credits' });
//         return;
//       }

//       const insertDebitedQuery = `INSERT INTO points_debited (user_id, point_debited) VALUES ('${user_id}', ${deductAmount})`;

//       conn.query(insertDebitedQuery, (err) => {
//         if (err) {
//           console.error('Error inserting debited credits:', err);
//           res.status(500).json({ status: 500, message: 'Error inserting debited credits' });
//           return;
//         }

//         res.status(200).json({ status: 200, message: 'Credits deducted and fetched updated credits', credits: updatedCredits });
//       });
//     });
//   });
// };



const addCredits = async (req, res) => {
  const { user_id, addAmount } = req.body;
  const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;
  conn.query(fetchCreditsQuery, (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      res.status(500).json({ status: 500, message: 'Error fetching credits' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }
    const currentCredits = result[0].point;
    const updatedCredits = currentCredits + parseInt(addAmount, 10);
    const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;
    conn.query(updateCreditsQuery, (err) => {
      if (err) {
        console.error('Error updating credits:', err);
        res.status(500).json({ status: 500, message: 'Error updating credits' });
        return;
      }
      res.status(200).json({ status: 200, message: 'Credits added and fetched updated credits', credits: updatedCredits });
    });
  });
};

const creditPoints = async (req, res) => {
  const { user_id, addAmount } = req.body;
  const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;
  conn.query(fetchCreditsQuery, (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      res.status(500).json({ status: 500, message: 'Error fetching credits' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: 'User not found' });
      return;
    }
    const currentCredits = result[0].point;
    const updatedCredits = currentCredits + parseInt(addAmount, 10);
    const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;
    conn.query(updateCreditsQuery, (err) => {
      if (err) {
        console.error('Error updating credits:', err);
        res.status(500).json({ status: 500, message: 'Error updating credits' });
        return;
      }
      res.status(200).json({ status: 200, message: 'Credits added and fetched updated credits', credits: updatedCredits });
    });

    const insertCreditsQuery = `INSERT INTO points_credited (user_id, point_credited) VALUES ('${user_id}', ${addAmount})`;
    conn.query(insertCreditsQuery, (err) => {
      if (err) {
        console.error('Error inserting credits:', err);
        res.status(500).json({ status: 500, message: 'Error inserting credits' });
        return;
      }
    });
  });
};


// const addCredits = async (req, res) => {
//   const { user_id, addAmount } = req.body;
//   const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;
  
//   conn.query(fetchCreditsQuery, (err, result) => {
//     if (err) {
//       console.error('Error fetching credits:', err);
//       res.status(500).json({ status: 500, message: 'Error fetching credits' });
//       return;
//     }
//     // Check if user exists
//     if (result.length === 0) {
//       res.status(404).json({ status: 404, message: 'User not found' });
//       return;
//     }
//     const currentCredits = result[0].point;
//     const updatedCredits = currentCredits + parseInt(addAmount, 10);
//     const updateCreditsQuery = `UPDATE users SET point = ${updatedCredits} WHERE user_id = '${user_id}'`;
    
//     conn.query(updateCreditsQuery, (err) => {
//       if (err) {
//         console.error('Error updating credits:', err);
//         res.status(500).json({ status: 500, message: 'Error updating credits' });
//         return;
//       }
      
//       const insertCreditsQuery = `INSERT INTO points_credited (user_id, point_credited) VALUES ('${user_id}', ${addAmount})`;
      
//       conn.query(insertCreditsQuery, (err) => {
//         if (err) {
//           console.error('Error inserting credits:', err);
//           res.status(500).json({ status: 500, message: 'Error inserting credits' });
//           return;
//         }
        
//         res.status(200).json({ status: 200, message: 'Credits added and fetched updated credits', credits: updatedCredits });
//       });
//     });
//   });
// };




  const fetchCredits = async (req, res) => {
    const { user_id } = req.body;
  
    // Fetch credits for the user
    const fetchCreditsQuery = `SELECT point FROM users WHERE user_id = '${user_id}'`;
  
    conn.query(fetchCreditsQuery, (err, result) => {
      if (err) {
        console.error('Error fetching credits:', err);
        res.status(500).json({ status: 500, message: 'Error fetching credits' });
        return;
      }
  
      // Check if user exists
      if (result.length === 0) {
        res.status(404).json({ status: 404, message: 'User not found' });
        return;
      }
  
      const credits = result[0].point;
  
      res.status(200).json({ status: 200, message: 'Credits fetched', credits: credits });
    });
  };
  



  const addPhoneNumber = async (req, res) => {       
    const { user_id, phone_number } = req.body;
  
    // Update the phone number for the user
    const updatePhoneNumberQuery = `UPDATE users SET phone_number = '${phone_number}' WHERE user_id = '${user_id}'`;
  
    conn.query(updatePhoneNumberQuery, (err, result) => {
      if (err) {
        console.error('Error adding phone number:', err);
        res.status(500).json({ status: 500, message: 'Error adding phone number' });
        return;
      }
  
      res.status(200).json({ status: 200, message: 'Phone Number added successfully' });
    });
  }; 



const saveBallData = async (req, res) => {
  const { user_id, ball_data } = req.body;

  // Update the ball data for the user
  const updateBallDataQuery = `UPDATE users SET ball_data = '${ball_data}' WHERE user_id = '${user_id}'`;

  conn.query(updateBallDataQuery, (err, result) => {
    if (err) {
      console.error('Error saving ball data:', err);
      res.status(500).json({ status: 500, message: 'Error saving ball data' });
      return;
    }

    res.status(200).json({ status: 200, message: 'Saved data successfully!' });
  });
};




const fetchBallData = async (req, res) => {     
    const { user_id } = req.body;
  
    // Fetch the ball data for the user
    const fetchBallDataQuery = `SELECT ball_data FROM users WHERE user_id = '${user_id}'`;
  
    conn.query(fetchBallDataQuery, (err, result) => {
      if (err) {
        console.error('Error fetching ball data:', err);
        res.status(500).json({ status: 500, message: 'Error fetching ball data' });
        return;
      }
  
      // Check if ball data exists
      const ballData = result.length > 0 ? result[0].ball_data : null;
  
      res.status(200).json({ status: 200, message: 'Loaded data successfully!', ball_data: ballData });
    });
  };





  const fetchAgentContact = async (req, res) => {
    const { user_id } = req.body;
  
    const checkUserQuery = `SELECT COUNT(*) AS userCount FROM users WHERE user_id = ?`;
  
    conn.query(checkUserQuery, [user_id], (err, result) => {
      if (err) {
        console.error('Error checking user:', err);
        res.status(500).json({ status: 500, message: 'Error checking user' });
        return;
      }
  
      const userCount = result.length > 0 ? result[0].userCount : 0;
  
      if (userCount === 0) {
        res.status(404).json({ status: 404, message: 'User not found' });
        return;
      }
  
      const fetchAgentPhoneNumberQuery = `SELECT agent_phoneNumber FROM users WHERE user_id = ?`;
  
      conn.query(fetchAgentPhoneNumberQuery, [user_id], (err, result) => {
        if (err) {
          console.error('Error fetching agent phone number:', err);
          res.status(500).json({ status: 500, message: 'Error fetching agent phone number' });
          return;
        }
  
        const agentPhoneNumber = result.length > 0 ? String(result[0].agent_phoneNumber) : null;
  
        const fetchAgentContactQuery = `SELECT whatsapp_number, email FROM admin_contact`;
  
        conn.query(fetchAgentContactQuery, (err, result) => {
          if (err) {
            console.error('Error fetching agent contact details:', err);
            res.status(500).json({ status: 500, message: 'Error fetching agent contact details' });
            return;
          }
  
          const agentContact = result.length > 0 ? result[0] : {};
  
          res.status(200).json({
            status: 200,
            message: 'Agent contact fetched',
            agent_phoneNumber: agentPhoneNumber,
            whatsapp_number: String(agentContact.whatsapp_number) || null,
            email: agentContact.email || null,
          });
        });
      });
    });
  };
  
  
  



  const getPlayerData = async (req, res) => {
    try {
      const sql = `SELECT * FROM users WHERE role_id = 0`;
      const players = await conn.query(sql);
  
      if (players.length > 0) {
        const responseData = {
          status: 200,
          message: "Success",
          data: players,
        };
        res.send(responseData);
      } else {
        const responseData = {
          status: 404,
          message: "No players found with role_id = 0",
          data: [],
        };
        res.status(404).send(responseData);
      }
    } catch (error) {
      console.error("Error fetching player data:", error);
      res.status(500).send("Database error");
    }
  };
  
  
  
  const getPlayerIdData = async (req, res) => {
    const sqlCount = `SELECT COUNT(*) as totalcount FROM users WHERE role_id = 0`;
    const result = await conn.query(sqlCount);
    const totalCount = result[0].totalcount;
  
    let playerid = "";

    if (totalCount >= 0 && totalCount <= 8) {
      playerid = "LF0000" + (totalCount + 1);
    } else if (totalCount === 9) {
      playerid = "LF000" + (totalCount + 1);
    } else if (totalCount / 10 >= 1 && totalCount / 10 <= 9) {
      playerid = "LF000" + (totalCount + 1);
    } else if (totalCount / 10 >= 10 && totalCount / 10 <= 99) {
      playerid = "LF00" + (totalCount + 1);
    } else if (totalCount / 10 >= 100 && totalCount / 10 <= 999) {
      playerid = "LF0" + (totalCount + 1);
    } else if (totalCount / 10 >= 1000 && totalCount / 10 <= 9999) {
      playerid = "LF" + (totalCount + 1);
    }

  
    console.log("playerId", playerid);
    statusCode = 200;
    message = "success";
    data = playerid;
  
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  };

  const fetchUsers = async (req, res) => {
    try {
      const fetchUsersQuery = 'SELECT user_id FROM users WHERE role_id = 0'; 
      conn.query(fetchUsersQuery, (err, result) => {
        if (err) {
          console.error('Error fetching users:', err);
          res.status(500).json({ status: 500, message: 'Error fetching users' });
          return;
        }
        const user_id = result.map((row) => row.user_id); 
        res.status(200).json(user_id);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ status: 500, message: 'Error fetching users' });
    }
  };
  
  
  

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { block } = req.body;
    const updateQuery = 'UPDATE users SET user_status = ? WHERE user_id = ?';
    await conn.query(updateQuery, [block ? 1 : 0, userId]);
    res.status(200).json({ status: 200, message: 'User status updated successfully' });
  } catch (error) {
    console.log('Error updating user status:', error);
    res.status(500).json({ status: 500, message: 'Failed to update user status' });
  }
};


const isUserBlocked = async (req, res) => {
  try {
    const { user_id } = req.body;
 
    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    const userResult = await conn.query(userQuery, [user_id]);
    if (userResult.length === 0) {
return res.status(404).json({ status: 404, message: 'User does not exist' });
    }
    const isBlocked = userResult[0].user_status === 1;
    if (isBlocked) {
      return res.status(200).json({ status: 200, message: 'User is blocked!', isUserBlocked: true });
    } else {
      return res.status(200).json({ status: 200, message: 'User is not blocked!', isUserBlocked: false });
    }
  } catch (error) {
    console.log('Error checking user block status:', error);
    res.status(500).json({ status: 500, message: 'Failed to check user block status' });
  }
};
  


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    const userResult = await conn.query(userQuery, [userId]);

    if (userResult.length === 0) {
      return res.status(404).json({ status: 404, message: 'User does not exist' });
    }

    const deleteQuery = 'DELETE FROM users WHERE user_id = ?';
    await conn.query(deleteQuery, [userId]);

    res.status(200).json({ status: 200, message: 'User deleted successfully' });
  } catch (error) {
    console.log('Error deleting user:', error);
    res.status(500).json({ status: 500, message: 'Failed to delete user' });
  }
};



const fetchContact = async (req, res) => {
  try {
    const query = 'SELECT agent_phoneNumber, whatsapp_number, email FROM admin_contact';
    conn.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching contact details:', err);
        res.status(500).json({ status: 500, message: 'Failed to fetch contact details' });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({ status: 500, message: 'Failed to fetch contact details' });
  }
};



const editUser = async (req, res) => {
  const { userId, phone_number, password } = req.body;

  try {
   
    const updateQuery = `UPDATE users SET phone_number = ?, password = ? WHERE user_id = ?`;
    const values = [phone_number, password, userId];

    conn.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error('Error editing user:', error);
        return res.status(500).json({ status: 500, message: 'Failed to edit user' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'User not found' });
      }

      return res.status(200).json({ status: 200, message: 'User updated successfully' });
    });
  } catch (error) {
    console.error('Error editing user:', error);
    return res.status(500).json({ status: 500, message: 'Failed to edit user' });
  }
};


const fetchAgentData = async (req, res) => {
  try {
    const sql = `SELECT * FROM agents`;
    const agents = await conn.query(sql);

    if (agents.length > 0) {
      const responseData = {
        status: 200,
        message: "Success",
        data: agents,
      };
      res.send(responseData);
    } else {
      const responseData = {
        status: 404,
        message: "No agents found",
        data: [],
      };
      res.status(404).send(responseData);
    }
  } catch (error) {
    console.error("Error fetching agent data:", error);
    res.status(500).send("Database error");
  }
};

const updateAgentPhoneNumber = async (req, res) => {
  try {
    const { user_id, agent_phoneNumber } = req.body;

    
    const sql = `UPDATE users SET agent_phoneNumber = ? WHERE user_id = ?`;
    await conn.query(sql, [agent_phoneNumber, user_id]);

    
    const responseData = {
      status: 200,
      message: "Agent phone number updated successfully",
    };
    res.send(responseData);
  } catch (error) {
    console.error("Error updating agent phone number:", error);
    res.status(500).send("Database error");
  }
};

const fetchAgentPhoneNumber = async (req, res) => {
  try {
    const { agent_name } = req.body;
    const sql = `SELECT agent_phoneNumber FROM agents WHERE agent_name = ?`;
    const result = await conn.query(sql, [agent_name]);

    if (result && result.length > 0) {
      const phoneNumber = result[0].agent_phoneNumber;
      const responseData = {
        status: 200,
        message: "Agent phone number fetched successfully",
        data: phoneNumber,
      };
      res.send(responseData);
    } else {
      const responseData = {
        status: 404,
        message: "Agent not found",
      };
      res.status(404).send(responseData);
    }
  } catch (error) {
    console.error("Error fetching agent phone number:", error);
    res.status(500).send("Database error");
  }
};



const deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id;

    const agentQuery = 'SELECT * FROM agents WHERE id = ?';
    const agentResult = await conn.query(agentQuery, [agentId]);

    if (agentResult.length === 0) {
      return res.status(404).json({ status: 404, message: 'Agent does not exist' });
    }

    const deleteQuery = 'DELETE FROM agents WHERE id = ?';
    await conn.query(deleteQuery, [agentId]);

    res.status(200).json({ status: 200, message: 'Agent deleted successfully' });
  } catch (error) {
    console.log('Error deleting agent:', error);
    res.status(500).json({ status: 500, message: 'Failed to delete agent' });
  }
};

const editAgent = async (req, res) => {
  const { id, agent_name, agent_phoneNumber, password } = req.body;

  try {
    const updateQuery = `UPDATE agents SET agent_name = ?, agent_phoneNumber = ?, password = ? WHERE id = ?`;
    const values = [agent_name, agent_phoneNumber, password, id];

    conn.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error('Error editing agent:', error);
        return res.status(500).json({ status: 500, message: 'Failed to edit agent' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ status: 404, message: 'Agent not found' });
      }

      return res.status(200).json({ status: 200, message: 'Agent updated successfully' });
    });
  } catch (error) {
    console.error('Error editing agent:', error);
    return res.status(500).json({ status: 500, message: 'Failed to edit agent' });
  }
};


const transactions = (req, res) => {
  const creditQuery = `SELECT * FROM points_credited`;
  const debitQuery = `SELECT * FROM points_debited`;

  conn.query(creditQuery, (error, creditResults) => {
    if (error) throw error;

    conn.query(debitQuery, (error, debitResults) => {
      if (error) throw error;

      const transactions = {
        credited: creditResults,
        debited: debitResults
      };

      res.json(transactions);
    });
  });
};


const getAgentPlayer = (req, res) => {
  const { email } = req.body;

 
  const agentQuery = `SELECT agent_phoneNumber FROM agents WHERE agent_email = ?`;
  conn.query(agentQuery, [email], (agentErr, agentResult) => {
    if (agentErr) {
      console.error(agentErr);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
      return;
    }

    if (agentResult.length === 0) {
      res.status(404).json({ status: 404, message: "Agent not found" });
      return;
    }

    const agentPhoneNumber = agentResult[0].agent_phoneNumber;

   
    const playerQuery = `SELECT * FROM users WHERE agent_phoneNumber = ?`;
    conn.query(playerQuery, [agentPhoneNumber], (playerErr, playerResult) => {
      if (playerErr) {
        console.error(playerErr);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
      }

      res.status(200).json({ status: 200, data: playerResult });
    });
  });
};


const getAgentDetail = async(req, res) => {

 
  try {
    const { email } = req.body;
    const sql = `SELECT * FROM agents WHERE agent_email	 = ?`;
    const result = await conn.query(sql, [email]);

    if ( result.length > 0) {
     // const phoneNumber = result[0].agent_phoneNumber;
      const responseData = {
        status: 200,
        message: "Agent phone number fetched successfully",
        data:result
        //: phoneNumber,
      };
      res.send(responseData);
    } else {
      const responseData = {
        status: 404,
        message: "Agent not found",
      };
      res.status(404).send(responseData);
    }
  } catch (error) {
    console.error("Error fetching agent phone number:", error);
    res.status(500).send("Database error");
  }
};


  module.exports = {deductCredits,
    getAgentDetail,
    addCredits,
    fetchCredits,
    addPhoneNumber,
    saveBallData,
    fetchBallData,
    fetchAgentContact,
    getPlayerIdData,
    getPlayerData,
    fetchUsers,
    blockUser,
    isUserBlocked,
    deleteUser,
    fetchContact,
    editUser,
    fetchAgentData,
    updateAgentPhoneNumber,
    fetchAgentPhoneNumber,
    deleteAgent,
    editAgent,
    transactions,
    creditPoints,
    debitPoints,
    getAgentPlayer
    

};