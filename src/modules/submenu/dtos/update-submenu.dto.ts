import { PartialType } from '@nestjs/swagger';
import { CreateSubmenuDto } from './create-submenu.dto';

export class UpdateSubmenuDto extends PartialType(CreateSubmenuDto) {}
