import { Text } from '../../../components/ui';
import useFetch from '../../../hooks/useFetch';
import styles from './styles/index.module.css';

export default function Analytics() {
  

  const url = import.meta.env.VITE_BACKEND_URL + '/tasks/analytics';
  const options = {credentials: 'include',}




  const { data, isLoading, error } = useFetch(url, options);

  // const getData = async()=>{
  //   const data = fetch(import.meta.env.VITE_BACKEND_URL + '/tasks/analytics',{
  //     credentials:'include',
  //   })
  // }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  const status = [
    { name: 'Backlog Tasks', value: 'backlog' },
    { name: 'To-do Tasks', value: 'todo' },
    { name: 'In-Progress Tasks', value: 'inProgress' },
    { name: 'Completed Tasks', value: 'done' },
  ];

  const priorities = [
    { name: 'Low Priority', value: 'low' },
    { name: 'Moderate Priority', value: 'moderate' },
    { name: 'High Priority', value: 'high' },
    { name: 'Due Date Tasks', value: 'due' },
  ];

  return (
    <div className={styles.container}>
      <Text step={5} weight="500">
        Analytics
      </Text>

      {data && (
        <div className={styles.lists}>
          <ul className={styles.listBox}>
            {status.map((s) => (
              <li key={s.value}>
                <div className="">
                  <Text>{s.name}</Text>
                  <Text weight='500'>{data.status[s.value]}</Text>
                </div>
              </li>
            ))}
          </ul>

          <ul className={styles.listBox}>
            {priorities.map((s) => (
              <li key={s.value}>
                <div className="">
                  <Text>{s.name}</Text>
                  <Text weight="500">{data.priorities[s.value]}</Text>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
