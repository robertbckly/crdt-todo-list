import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { Link } from '../../lib/link';
import { Item } from './item/item';

export const App = () => {
  const [data, setData] = useState('');

  // Testing...
  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';').map((string) => string.trim());
    const csrfToken =
      cookies
        .find((cookie) => cookie.startsWith('__Host-csrf='))
        ?.split('__Host-csrf=')[1] || '';

    let ignoreAsync = false;
    const loadData = async () => {
      const response = await fetch('/api', {
        method: 'GET',
        // body: JSON.stringify({ items: [1, 2, 3] }),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });
      const parsedJson = await response.json();
      console.log(parsedJson);
      if (!ignoreAsync) {
        setData(parsedJson.toString());
      }
    };

    loadData();
    return () => {
      ignoreAsync = true;
    };
  }, []);

  const [items, setItems] = useState(['1', '2', '3']);

  console.log(items);

  const handleChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
  };

  return (
    <main className="m-4">
      <h1>Hello :-)</h1>
      {!data && <Link to={ROUTES.login}>Login</Link>}
      {data && <p>{data}</p>}
      <ul className="flex flex-col gap-2 border p-2">
        {items.map((item, index) => (
          <Item
            value={item}
            onChange={(event) => handleChange(index, event.target.value)}
          />
        ))}
      </ul>
    </main>
  );
};
