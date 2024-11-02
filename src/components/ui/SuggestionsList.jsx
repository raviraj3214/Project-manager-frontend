import PropTypes from 'prop-types';
import styles from './styles/SuggestionsList.module.css';

const SuggestionsList = ({ suggestions, onSelect }) => {
  return (
    <ul className={styles.suggestionsList}>
      {suggestions.map((suggestion) => {
        const initials = suggestion.user.email.slice(0, 2).toUpperCase();
        return (
          <li key={suggestion.user.email} className={styles.suggestionItem}>
            <div className={styles.icon}>{initials}</div>
            <span className={styles.email}>{suggestion.user.email}</span>
            <button className={styles.assignButton} onClick={() => onSelect(suggestion.user.email)}>
              Assign
            </button>
          </li>
        );
      })}
    </ul>
  );
};

SuggestionsList.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SuggestionsList;
