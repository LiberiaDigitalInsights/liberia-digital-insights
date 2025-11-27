import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';

const AdminTalent = () => {
  const talents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      skills: 'React, Node.js, UI/UX',
      experience: '5 years',
      status: 'available',
    },
    {
      id: 2,
      name: 'Michael Chen',
      skills: 'Python, Machine Learning, Data Science',
      experience: '3 years',
      status: 'employed',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Talent Hub</h1>
        <p className="text-[var(--color-muted)]">Connect with Liberia's tech talent pool</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Talent Directory ({talents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {talents.map((talent) => (
              <div key={talent.id} className="p-4 border border-[var(--color-border)] rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--color-text)]">{talent.name}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{talent.skills}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {talent.experience} experience
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      talent.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {talent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTalent;
