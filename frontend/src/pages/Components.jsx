import React from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { H1, H2, Muted } from '../components/ui/Typography';

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <div className="space-y-2">
        <H1>Components</H1>
        <Muted>Live examples of design system primitives.</Muted>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Button</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Your name" />
            <Input placeholder="Email" type="email" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              <option>One</option>
              <option>Two</option>
              <option>Three</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <H2>Section Heading</H2>
            <Muted>Muted helper text for descriptions and meta content.</Muted>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
