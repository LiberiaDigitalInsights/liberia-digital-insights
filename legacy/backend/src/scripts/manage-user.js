import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function manageUser(email, password, role, firstName, lastName) {
  try {
    const validRoles = ["admin", "editor", "moderator", "viewer"];
    if (!validRoles.includes(role)) {
      console.error(
        `Invalid role: ${role}. Valid roles are: ${validRoles.join(", ")}`,
      );
      process.exit(1);
    }

    console.log(`Checking if user ${email} exists...`);
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    if (existingUser) {
      console.log(
        `User already exists. Updating password and setting role to ${role}...`,
      );

      const { error } = await supabase
        .from("users")
        .update({
          password_hash,
          role: role,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) throw error;
      console.log(`User ${email} updated successfully!`);
    } else {
      console.log(`Creating new user with role: ${role}...`);

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email,
            password_hash,
            first_name: firstName,
            last_name: lastName,
            role: role,
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      console.log(`User created successfully: ${data.email} (${data.role})`);
    }
  } catch (error) {
    console.error("Error managing user:", error.message);
  }
}

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(
    "Usage: node manage-user.js <email> <password> <role> [firstName] [lastName]",
  );
  console.log("Roles: admin, editor, moderator, viewer");
  process.exit(1);
}

const [email, password, role, firstName = "User", lastName = "Name"] = args;
manageUser(email, password, role, firstName, lastName);
