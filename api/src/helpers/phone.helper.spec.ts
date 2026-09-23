import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  PHONE_INVALID_MESSAGE,
  normalizePhoneNumber,
  phoneSearchDigits,
} from './phone.helper';
import { RegisterDto } from '../modules/auth/dto/register.dto';
import { UpdateProfileDto } from '../modules/auth/dto/update-profile.dto';
import { UpdateContributorDto } from '../modules/contributors/dto/update-contributor.dto';

describe('normalizePhoneNumber', () => {
  it('stores international input as E.164', () => {
    expect(normalizePhoneNumber(' +250 788 123 456 ')).toBe('+250788123456');
  });

  it('reads a local number with the default country', () => {
    expect(normalizePhoneNumber('0788 123 456', 'RW')).toBe('+250788123456');
  });

  it('passes an unparseable value through for validation to reject', () => {
    expect(normalizePhoneNumber('0788')).toBe('0788');
  });

  it('turns a blank value into null so the number is cleared', () => {
    expect(normalizePhoneNumber('   ')).toBeNull();
  });

  it('leaves non-strings alone', () => {
    expect(normalizePhoneNumber(undefined)).toBeUndefined();
    expect(normalizePhoneNumber(null)).toBeNull();
  });
});

describe('phoneSearchDigits', () => {
  it('matches a full local number against its E.164 form', () => {
    expect(phoneSearchDigits('0788 123 456')).toBe('250788123456');
  });

  it('drops the trunk zero from a partial number', () => {
    expect(phoneSearchDigits('0788')).toBe('788');
  });

  it('ignores keys that are not phone-like', () => {
    expect(phoneSearchDigits('Kigali')).toBeUndefined();
    expect(phoneSearchDigits('07')).toBeUndefined();
  });
});

const errorsFor = async <T extends object>(dto: new () => T, body: object) => {
  const errors = await validate(plainToInstance(dto, body));
  return errors.filter((error) => error.property === 'phoneNumber');
};

describe('@PhoneNumberField on request DTOs', () => {
  const register = {
    email: 'artist@example.com',
    name: 'Artist',
    password: 'Password1!',
  };

  it.each(['0788', '+2507', 'not a phone'])('rejects %s', async (phoneNumber) => {
    const errors = await errorsFor(RegisterDto, { ...register, phoneNumber });
    expect(errors).toHaveLength(1);
    expect(Object.values(errors[0].constraints ?? {})).toContain(PHONE_INVALID_MESSAGE);
  });

  it('accepts and normalizes a dialable number', async () => {
    const dto = plainToInstance(UpdateContributorDto, {
      phoneNumber: '+44 20 7946 0958',
    });
    expect(dto.phoneNumber).toBe('+442079460958');
    expect(await errorsFor(UpdateContributorDto, { phoneNumber: '+44 20 7946 0958' })).toHaveLength(0);
  });

  it('accepts a missing number', async () => {
    expect(await errorsFor(RegisterDto, register)).toHaveLength(0);
  });

  it('lets the profile clear its number', async () => {
    const dto = plainToInstance(UpdateProfileDto, { phoneNumber: '' });
    expect(dto.phoneNumber).toBeNull();
    expect(await errorsFor(UpdateProfileDto, { phoneNumber: '' })).toHaveLength(0);
  });
});
