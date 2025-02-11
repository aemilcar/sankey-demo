// app/routes/index.jsx
import React from 'react';
import { useState } from 'react';
import { Form, useActionData, redirect } from '@remix-run/react';
// import { json } from '@remix-run/node';
import { json } from '@remix-run/server-runtime';
import { Sankey, Tooltip } from 'recharts';

export async function action({ request }) {
  const formData = await request.formData();
  const content = formData.get('content');

  // POST to your REST API
  const response = await fetch('http://0.0.0.0:8000/generate-chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  const data = await response.json();

  // Return Sankey data to the component
  return json({ data });
}

export default function Index() {
  const actionData = useActionData();
  const [sankeyData, setSankeyData] = useState(null);

  // Whenever we get new data from the action, set it in local state
  React.useEffect(() => {
    if (actionData?.data) {
      setSankeyData(actionData.data);
    }
  }, [actionData]);

  const CustomNode = ({ x, y, width, height, payload }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#8884d8"
        fillOpacity={0.9}
      />
      <text
        x={x + width + 6}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="middle"
        fill="#333"
        fontSize={12}
      >
        {payload.name}
      </text>
    </g>
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sankey Example</h1>

      <Form method="post" className="flex items-center gap-2 mb-4">
        <input
          name="content"
          type="text"
          placeholder="Enter content..."
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </Form>

      {sankeyData && (
        <div className="w-full h-96">
          <Sankey
            width={800}
            height={400}
            data={sankeyData}
            node={<CustomNode />}
            nodePadding={50}
            margin={{ top: 50, bottom: 50, left: 200, right: 200 }}
            link={{ stroke: '#77c878' }}
          >
            <Tooltip />
          </Sankey>
        </div>
      )}
    </div>
  );
}
