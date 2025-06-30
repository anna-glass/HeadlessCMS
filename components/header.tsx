//
// header.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// header component (navigation and profile)
//

import Image from 'next/image';
import { UserButton } from '@stackframe/stack';

export async function Header() {
    return (
        <header className="w-full flex justify-between items-center px-6 py-4 z-10">
            <div className="font-medium text-[15px] tracking-tight">
                <Image src="/logo.svg" alt="logo" width={50} height={28} priority />
            </div>
            <div className="flex items-center gap-4">
                <UserButton />
            </div>
        </header>
    );
}
