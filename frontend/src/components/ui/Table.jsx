import React from 'react';

export const Table = ({ columns, data, actions = null, loading = false }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm space-x-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
