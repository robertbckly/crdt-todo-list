import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { Link } from '../../lib/link';
import { Item } from './item/item';
import { ItemForm } from './item-form/item-form';

export const App = () => {
  const [data, setData] = useState('');
  console.log(data);

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
      if (!ignoreAsync) {
        setData(parsedJson.toString());
      }
    };

    loadData().catch(() => {});
    return () => {
      ignoreAsync = true;
    };
  }, []);

  const [items, setItems] = useState(['1', '2', '3']);
  const haveItems = !!items.length;

  const handleCreate = (newValue: string) => {
    const newItems = [...items];
    newItems.unshift(newValue);
    setItems(newItems);
  };

  const handleEdit = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
  };

  const handleDelete = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <main className="m-4 max-w-md">
      <h1>Hello :-)</h1>

      {!data && <Link to={ROUTES.login}>Login</Link>}

      <div className="mt-2 flex flex-col gap-2 rounded border p-2">
        <ItemForm onCreate={handleCreate} />
        {haveItems && (
          <ul aria-label="items" className="flex flex-col gap-2">
            {items.map((item, index) => (
              <Item
                value={item}
                isLastInList={index === items.length - 1}
                onEdit={(event) => handleEdit(index, event.target.value)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
