import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/embat-puppy-fb/us-central1/api/docs/', 302)
  redirectToDocs() {
    return;
  }
}
