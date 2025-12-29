import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Edit2, Check, Camera } from 'lucide-react';

const ProfilePanel = ({ isOpen, onClose, userData, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false); 
  

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '' 
  });

  
  useEffect(() => {
    if (userData) {
      setFormData({ 
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        password: '' 
      });
    }
  }, [userData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
   
    const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
    };


    if (changePasswordMode && formData.password) {
        payload.password = formData.password;
    }

    const success = await onUpdateProfile(payload);
    
    if(success) {
        setIsEditing(false);
        setChangePasswordMode(false);
        setFormData(prev => ({ ...prev, password: '' })); 
    }
  };

  const handleCancel = () => {
      setIsEditing(false);
      setChangePasswordMode(false);
    
      setFormData({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: ''
      });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: 350, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="right-sidebar profile-panel"
        >
        
          <div className="panel-header">
            <h3>User Profile</h3>
            <button onClick={onClose} className="close-btn"><X size={20} /></button>
          </div>

          <div className="profile-header">
            <div className="avatar-large">
              {formData.firstname?.[0]}{formData.lastname?.[0]}
              {isEditing && (
                <div className="edit-avatar-overlay">
                  <Camera size={20} />
                </div>
              )}
            </div>
            <h2>{formData.firstname} {formData.lastname}</h2>
            <p className="role-badge">Member</p>
          </div>

         
          <div className="profile-details">
            
            <div className="input-group">
              <label><User size={16}/> First Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="firstname" 
                  value={formData.firstname} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
            </div>

            <div className="input-group">
              <label><User size={16}/> Last Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="lastname" 
                  value={formData.lastname} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : ''}
                />
              </div>
            </div>

           
            <div className="input-group">
              <label><Mail size={16}/> Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled={true} 
                  className="disabled"
                />
              </div>
            </div>

         
            <div className="input-group">
              <label><Lock size={16}/> Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  name="password"
                  value={changePasswordMode ? formData.password : "********"} 
                  onChange={handleChange}
                  disabled={!changePasswordMode} 
                  className={changePasswordMode ? 'editable' : ''}
                  placeholder={changePasswordMode ? "Type new password..." : ""}
                />
                
                {isEditing && (
                  <button 
                    className="change-btn" 
                    onClick={() => {
                        setChangePasswordMode(!changePasswordMode);
                        if(changePasswordMode) setFormData(prev => ({...prev, password: ''})); 
                    }}
                  >
                    {changePasswordMode ? "Cancel" : "Change"}
                  </button>
                )}
              </div>
            </div>

          </div>

          
          <div className="profile-actions">
            {!isEditing ? (
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>
                <Edit2 size={18} /> Edit Profile
              </button>
            ) : (
              <div style={{display:'flex', gap:'10px', width:'100%'}}>
                  <button className="action-btn cancel" onClick={handleCancel} style={{background:'transparent', border:'1px solid var(--border-color)', color:'var(--text-secondary)'}}>
                    Cancel
                  </button>
                  <button className="action-btn save" onClick={handleSave}>
                    <Check size={18} /> Save Changes
                  </button>
              </div>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;