import config from "../config/config.js";

import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
     
        console.log("Appwrite service :: getCurrentUser :: error", error);
      
    }
    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }

  async sendVerification(url) {
    try {
      return await this.account.createVerification(url);
    } catch (error) {
      console.log("Appwrite service :: sendVerification :: error", error);
      throw error;
    }
  }

  async confirmVerification(userId, secret) {
    try {
      return await this.account.updateVerification(userId, secret);
    } catch (error) {
      console.log("Appwrite service :: confirmVerification :: error", error);
      throw error;
    }
  }

  async sendPasswordRecovery(email, url) {
    try {
      return await this.account.createRecovery(email, url);
    } catch (error) {
      console.log("Appwrite service :: sendPasswordRecovery :: error", error);
      throw error;
    }
  }

  async confirmPasswordReset(userId, secret, password) {
    try {
      return await this.account.updateRecovery(userId, secret, password);
    } catch (error) {
      console.log("Appwrite service :: confirmPasswordReset :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
