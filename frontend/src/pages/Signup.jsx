import React from 'react';
import { H1, Muted } from '../components/ui/Typography';
import { Field, Label, HelperText } from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Signup() {
  return (
    <div className="mx-auto max-w-lg p-6 space-y-4">
      <H1>Sign Up</H1>
      <form className="space-y-4">
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
          <HelperText>We’ll send occasional updates.</HelperText>
        </Field>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <Muted>By signing up, you agree to our terms.</Muted>
    </div>
  );
}
