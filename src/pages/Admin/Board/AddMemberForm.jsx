import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './styles/AddMemberForm.module.css';
import toast from 'react-hot-toast';

const AddMemberForm = ({ toggleModal }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New success message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + `/members/addmember`,
        {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data = await res.json(); 
      if (data.status) { 
        setShowSuccessMessage(true); 
      } else {
        toast.error("Failed to add member."); 
      }

    
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {showSuccessMessage ? (
        <div className={styles.successMessage}>
         <p className= {styles.para}> {email} added to board  </p>
          <button  className={styles.btn2} onClick={()=>setShowSuccessMessage(false)}>
              Okay, got it!
            </button>
        </div>
      ) : (
        <>
          <div className={styles.input}>
            <label htmlFor="emailInput" className={styles.lab}>
              Add people to the board <span style={{ color: 'black' }}>*</span>
            </label>
            <input
              type="email"
              id="emailInput"
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.btn1} onClick={toggleModal}>
              Cancel
            </button>
            <button type="submit" className={styles.btn2}>
              {isLoading ? 'Submitting...' : 'Add Email'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

AddMemberForm.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default AddMemberForm;