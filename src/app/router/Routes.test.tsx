import { router } from "./Routes"; // مسیر صحیح به فایل روت‌ها

describe("Router setup", () => {
  it("should have a route for /forget-password", () => {
    const isForgetPasswordRouteDefined = router.routes.some(route => 
      route.children?.some(child => child.path === "/forget-password")
    );

    expect(isForgetPasswordRouteDefined).toBe(true);  // باید مسیر موجود باشد
  });
});
