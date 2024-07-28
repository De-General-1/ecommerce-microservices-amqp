const axios = require('axios');


exports.userDashboard = async (req, res) => {
    try {
      const userId = req.session.userId; // Assuming you have the user ID stored in the session
      const response = await fetch(`http://localhost:3006/auth/${userId}`, {
        headers: {
          'Authorization': `Bearer ${req.session.token}`, // Assuming you have a token stored in the session
          'Content-Type': 'application/json'
        }
      });
      console.log(userId)
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      res.render('userDashboard', { user: userData });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.updateUserProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      const response = await fetch(`http://localhost:3006/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${req.session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        console.log(updatedUser)
        res.redirect('/userDashboard');
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.deleteAccount = async (req, res) => {
    try {
      const userId = req.session.userId;
      const response = await fetch(`http://localhost:3006/auth/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${req.session.token}`
        }
      });
  
      if (response.ok) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to destroy session' });
          }
          res.redirect('/');
        });
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };