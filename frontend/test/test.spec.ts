import { test, expect } from '@playwright/test';

//Test 1
  test('login button appears on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const loginButton = await page.locator('button', {hasText: 'Login'});

    await expect(loginButton).toBeVisible();
  });

  //Test 2
  test('create user button appears on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const createUserButton = await page.locator('button', {hasText: 'Create user'});

    await expect(createUserButton).toBeVisible();
  });

//Test 3
  test('login successful', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.fill('input[name="login_form_username"]', 'guypas'); //user name from database
    await page.fill('input[name="login_form_password"]', '1234'); //password from database
    await page.click('button[name="login_form_login"]');
    const addNoteButton = page.locator('button', {hasText: 'Add note'});
    await expect(addNoteButton).toBeVisible();
  });

  //Test 4
  test('add note button shows only for logged in user', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const addNoteButton = page.locator('button', {hasText: 'Add note'});
    await expect(addNoteButton).toBeHidden();
  });

  //Test 5
  test('check that a user fills email while registering', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.fill('input[name="create_user_form_email"]', "test@test.com");
    const emailFilled = page.locator('input[name="create_user_form_email"]');
    await expect(emailFilled).toHaveValue("test@test.com");
  });



