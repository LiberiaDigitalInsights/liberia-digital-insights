import React from 'react';
import NewsletterSystem from './NewsletterSystem';

const AdminNewsletter = ({ canEdit }) => {
  return <NewsletterSystem canEdit={canEdit} />;
};

export default AdminNewsletter;