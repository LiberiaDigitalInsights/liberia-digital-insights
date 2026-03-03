import React from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { H1, H2, Muted } from '../components/ui/Typography';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import { Field, Label, HelperText, ErrorText } from '../components/ui/Form';
import { Tabs } from '../components/ui/Tabs';
import Accordion from '../components/ui/Accordion';
import Table from '../components/ui/Table';

export default function ComponentsPage() {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useToast();
  const [tab, setTab] = React.useState('one');
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
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button loading loadingText="Loading">
                Action
              </Button>
              <Button variant="outline" leftIcon={<span aria-hidden>⚙️</span>}>
                With Left Icon
              </Button>
              <Button variant="subtle" rightIcon={<span aria-hidden>➡️</span>}>
                With Right Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'one', label: 'One', content: <div className="text-sm">Tab One</div> },
                { value: 'two', label: 'Two', content: <div className="text-sm">Tab Two</div> },
                {
                  value: 'three',
                  label: 'Three',
                  content: <div className="text-sm">Tab Three</div>,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accordion</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              items={[
                { title: 'What is LDI?', content: 'Liberia Digital Insights platform overview.' },
                { title: 'How to contribute?', content: 'Open a PR and follow our guidelines.' },
                { title: 'Contact', content: 'Reach out via the Contact page.' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'role', header: 'Role' },
                { key: 'status', header: 'Status' },
              ]}
              data={[
                { name: 'Sarah Johnson', role: 'Editor', status: 'Active' },
                { name: 'James Doe', role: 'Writer', status: 'Pending' },
                { name: 'A. Mensah', role: 'Admin', status: 'Active' },
              ]}
            />
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

        <Card>
          <CardHeader>
            <CardTitle>Badge</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="solid">Solid</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert title="Heads up!">Informational alert with details.</Alert>
            <Alert variant="success" title="Success">
              Everything went well.
            </Alert>
            <Alert variant="warning" title="Warning">
              Check your inputs.
            </Alert>
            <Alert variant="danger" title="Error">
              Something went wrong.
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modal and Toast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setOpen(true)}>Open Modal</Button>
            <Button
              variant="secondary"
              onClick={() =>
                showToast({
                  title: 'Saved',
                  description: 'Your changes were saved.',
                  variant: 'success',
                })
              }
            >
              Show Success Toast
            </Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title="Example Modal"
              footer={
                <>
                  <Button variant="subtle" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOpen(false)}>Confirm</Button>
                </>
              }
            >
              This is a simple modal using our design tokens.
            </Modal>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
                <HelperText>This will be displayed on your profile.</HelperText>
              </Field>
              <Field>
                <Label htmlFor="role">Role</Label>
                <Select id="role" defaultValue="">
                  <option value="" disabled>
                    Choose a role
                  </option>
                  <option>Designer</option>
                  <option>Engineer</option>
                  <option>Product</option>
                </Select>
                <ErrorText>Please choose a role.</ErrorText>
              </Field>
              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="subtle">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
