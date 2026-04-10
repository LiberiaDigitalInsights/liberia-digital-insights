-- Create invitations table for secure user onboarding
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'editor',
    token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for token lookups (registration flow)
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);

-- Index for email lookups (duplicate prevention)
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);

-- Comments for documentation
COMMENT ON TABLE invitations IS 'Tracks pending user invitations and secure registration tokens';
COMMENT ON COLUMN invitations.token IS 'Secure random string for verifying the invitation';
COMMENT ON COLUMN invitations.expires_at IS 'When the invitation link becomes invalid';

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_update_invitations_updated_at ON invitations;
CREATE TRIGGER tr_update_invitations_updated_at
    BEFORE UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_invitations_updated_at();
