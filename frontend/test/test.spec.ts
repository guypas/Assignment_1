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
  test('logout button shows only for logged in user', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const logoutButton = page.locator('button', {hasText: 'Logout'});
    await expect(logoutButton).toBeHidden();
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



