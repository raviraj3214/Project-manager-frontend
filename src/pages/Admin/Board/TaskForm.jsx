import { RadioGroup } from '@headlessui/react';
import { Trash2, ChevronDown } from 'lucide-react'; // Import necessary icons
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../store/AuthProvider';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { Button, Text } from '../../../components/ui';
import { TasksContext } from '../../../store/TaskProvider';
import SuggestionsList from '../../../components/ui/SuggestionsList'; 
import styles from './styles/TaskForm.module.css';
import toast from 'react-hot-toast';

const dummyTask = {
  title: '',
  checklists: [],
  priority: 'high',
  email: '',
};

export default function TaskForm({
  defaultTask = dummyTask,
  toggleModal,
  action = 'add',
}) {
  const [task, setTask] = useImmer(defaultTask);
  const { majorTaskUpdate, addTask } = useContext(TasksContext);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleAddTask = async () => {
    setIsLoading(true);
    try {
      await addTask(task);
      toggleModal();
      toast.success('Successfully added task!');
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const handleUpdateTask = async () => {
    setIsLoading(true);
    try {
      await majorTaskUpdate(task._id, task);
      toggleModal();
      toast.success('Successfully updated task!');
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const updateTitle = (value) => {
    setTask((draft) => {
      draft.title = value;
    });
  };

  const changePriority = (priority) => {
    setTask((draft) => {
      draft.priority = priority;
    });
  };

  const addList = () => {
    setTask((draft) => {
      draft.checklists.push({
        checked: false,
        title: '',
        _id: uuidv4(),
        isNew: true,
      });
    });
  };

  const deletList = (id) => {
    setTask((draft) => {
      draft.checklists = draft.checklists.filter((list) => list._id !== id);
    });
  };

  const updateListChecked = (listId, value) => {
    setTask((draft) => {
      let list = draft.checklists.find((list) => list._id === listId);
      if (!list) return;
      list.checked = value;
    });
  };

  const updateListTitle = (listId, value) => {
    setTask((draft) => {
      let list = draft.checklists.find((list) => list._id === listId);
      if (!list) return;
      list.title = value;
    });
  };

  const updateAssignedTo = async (value) => {
    setTask((draft) => {
      draft.email = value;
    });

    if (value) {
      setLoadingSuggestions(true);
      setSuggestionsOpen(true); // Open the suggestions when typing starts
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/members/suggestions?email=${value}`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        setSuggestions(data.data); // Assuming the API returns an array of member names
      } catch (error) {
        console.error('Error fetching members:', error);
      }
      setLoadingSuggestions(false);
    } else {
      setSuggestions([]);
      setSuggestionsOpen(false); // Close suggestions if input is cleared
    }
  };

  const selectSuggestion = (selectedEmail) => {
    setTask((draft) => {
      draft.email = selectedEmail; // Update email with selected suggestion
    });
    setSuggestions([]);
    setSuggestionsOpen(false); // Close suggestions after selection
  };

  const toggleSuggestions = () => {
    setSuggestionsOpen((prev) => !prev); // Toggle suggestions visibility
  };
  const updateDate = (value) => {
        setTask((draft) => {
          draft.dueDate = value;
        });
      };

  const dones = task?.checklists.filter((list) => list.checked);

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <label htmlFor="taskTitle">
          Title <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          placeholder="Title"
          type="text"
          id="taskTitle"
          value={task.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      {(!defaultTask.createdBy || user._id === defaultTask.createdBy) && (
      <div className={styles.input}>
        
        <div className={styles.assignToContainer}>
        <label htmlFor="assignTo">
          Assign to
        </label>
          <input
            placeholder="Add a assignee"
            type="text"
            id="assignTo"
            value={task.email}
            onChange={(e) => updateAssignedTo(e.target.value)}
            onFocus={toggleSuggestions} // Open suggestions on focus
            autoComplete='off'
          />
          <ChevronDown
           className={`${styles.dropdownIcon} ${suggestionsOpen ? styles.rotated : ''}`}
           onClick={toggleSuggestions}
          />
        </div>
        {loadingSuggestions && <p>Loading suggestions...</p>}
        
        {suggestionsOpen && suggestions.length > 0 && (
          <div className={styles.suggestionsList}>
          <SuggestionsList suggestions={suggestions} onSelect={selectSuggestion}  />
          </div>
        )}
      </div>)}

      <RadioGroup
        className={styles.radioGroup}
        value={task.priority}
        onChange={changePriority}
      >
        <RadioGroup.Label>
          Select Priority <span style={{ color: 'red' }}>*</span>
        </RadioGroup.Label>

        <div className={styles.radioOptions}>
          <RadioGroup.Option value="high">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <Text step={1}>
                  <span style={{ color: '#ff2473' }}>•</span> HIGH PRIORITY
                </Text>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="moderate">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <Text step={1}>
                  <span style={{ color: '#18b0ff' }}>•</span> MODERATE PRIORITY
                </Text>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="low">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <Text step={1}>
                  <span style={{ color: '#63c05b' }}>•</span> LOW PRIORITY
                </Text>
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>

      <div className={styles.checklists}>
        <Text>
          Checklist ({(dones.length ?? 0) + '/' + (task?.checklists.length ?? 0)}){' '}
          <span style={{ color: 'red' }}>*</span>
        </Text>

        <div className={styles.lists}>
          {task?.checklists.map((list) => (
            <div className={styles.list} key={list._id}>
              <input
                type="checkbox"
                checked={list.checked}
                onChange={(e) => updateListChecked(list._id, e.target.checked)}
              />
              <input
                type="text"
                value={list.title}
                onChange={(e) => updateListTitle(list._id, e.target.value)}
              />
              <button onClick={() => deletList(list._id)} type="button">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addButton}>
          <Button onClick={addList} variant="ghost">
            + Add New
          </Button>
        </div>
      </div>

      {/* <div className={styles.actions}>
      <Button className={styles.btn1} onClick={toggleModal}>
              Cancel
            </Button>
        <Button onClick={action === 'add' ? handleAddTask : handleUpdateTask} disabled={isLoading}>
          {action === 'add' ? 'Add Task' : 'Update Task'}
        </Button>
      </div> */}

      <div className={styles.buttonGroup}>
         <div className={styles.datePicker}>
           {task.dueDate ? (
             <input
               id="dueDatePicker"
               value={new Date(task.dueDate).toISOString().split('T')[0]}
               placeholder='Select Due Date'
               type="date"
               onChange={(e) => updateDate(new Date(e.target.value))}
             />
           ) : (
             <input
               id="dueDatePicker"
               placeholder='Select Due Date'
               type="date"
               onChange={(e) => updateDate(new Date(e.target.value))}
             />
           )}
         </div>

         <div className={styles.actions}>
           <Button variant="outline" color="error" onClick={toggleModal}>
             Cancel
           </Button>
           <Button onClick={action == 'add' ? handleAddTask : handleUpdateTask}>
             {isLoading ? 'Saving...' : 'Save'}
           </Button>
         </div>
       </div>
    </div>
  );
}

TaskForm.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  action: PropTypes.oneOf(['add', 'edit']),
  defaultTask: PropTypes.shape({
    title: PropTypes.string,
    checklists: PropTypes.arrayOf(
      PropTypes.shape({
        checked: PropTypes.bool,
        title: PropTypes.string,
        _id: PropTypes.string,
        isNew: PropTypes.bool,
      })
    ),
    priority: PropTypes.oneOf(['high', 'moderate', 'low']),
    email: PropTypes.string,
  }),
};