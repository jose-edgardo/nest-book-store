import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':roleId')
  async getRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<ReadRoleDto> {
    return await this._roleService.get(roleId);
  }

  @Get()
  async getRoles(): Promise<ReadRoleDto[]> {
    return await this._roleService.getAll();
  }

  @Post()
  async createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    return await this._roleService.create(role);
  }

  @Patch(':roleId')
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() role: Partial<UpdateRoleDto>,
  ) {
    return await this._roleService.update(roleId, role);
  }

  @Delete(':roleId')
  async deleteRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<void> {
    await this._roleService.delete(roleId);
  }
}
