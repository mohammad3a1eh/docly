import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const valid = await compare(password, user.password);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = sign({ sub: user.id, role: user.role }, process.env.AUTH_SECRET || 'secret');
  const response = NextResponse.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  response.cookies.set('auth', token, { httpOnly: true, path: '/', sameSite: 'lax' });
  return response;
}
