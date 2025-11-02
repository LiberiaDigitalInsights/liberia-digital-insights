import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Field, Label, HelperText } from '../ui/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function NewsletterWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NEWSLETTER SIGNUP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Sign up for our weekly newsletter and get the latest industry insights right in your
          inbox.
        </p>
        <form className="space-y-3">
          <Field>
            <Label htmlFor="newsletter-name">Name</Label>
            <Input id="newsletter-name" placeholder="Your name" />
          </Field>
          <Field>
            <Label htmlFor="newsletter-email">Your Email</Label>
            <Input id="newsletter-email" type="email" placeholder="you@example.com" />
          </Field>
          <Field>
            <Label htmlFor="newsletter-company">Company</Label>
            <Input id="newsletter-company" placeholder="Company" />
          </Field>
          <Field>
            <Label htmlFor="newsletter-org">Organization</Label>
            <Input id="newsletter-org" placeholder="Organization" />
          </Field>
          <Field>
            <Label htmlFor="newsletter-position">Position</Label>
            <Input id="newsletter-position" placeholder="Position" />
          </Field>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
