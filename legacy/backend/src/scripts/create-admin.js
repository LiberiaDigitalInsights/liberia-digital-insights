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

async function createAdmin(email, password, firstName, lastName) {
  try {
    console.log(`Checking if user ${email} exists...`);
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log(
        "User already exists. Updating password and role to admin...",
      );
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const { error } = await supabase
        .from("users")
        .update({
          password_hash,
          role: "admin",
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) throw error;
      console.log("Admin user updated successfully!");
    } else {
      console.log("Creating new admin user...");
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email,
            password_hash,
            first_name: firstName,
            last_name: lastName,
            role: "admin",
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      console.log("Admin user created successfully:", data.email);
    }
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(
    "Usage: node create-admin.js <email> <password> [firstName] [lastName]",
  );
  process.exit(1);
}

const [email, password, firstName = "Admin", lastName = "User"] = args;
createAdmin(email, password, firstName, lastName);
