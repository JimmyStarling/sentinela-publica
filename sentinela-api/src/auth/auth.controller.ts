import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  getLogin(email: string, password: string): string {
    return 'Login feito com sucesso!';
  }

  /**constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Authenticate user
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Refresh access token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  // Logout user
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }

  // Get authenticated user's profile
  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user);
  }

  // Request password reset
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // Reset password using a token
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  // Change password for authenticated user
  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() req: Request,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(
      req.user,
      currentPassword,
      newPassword,
    );
  }

  // Verify email address
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // Resend email verification
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }	

  @Get('404')
  @HttpCode(HttpStatus.GET)
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }**/


}
