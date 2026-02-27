import { Heading } from '@/components/text/Headings'
import UserLayout from '@/containers/UserLayout'

const RolesPage = () => {
  return (
    <UserLayout>
        <main className='w-full flex flex-col gap-4'>
            <nav className='w-full flex items-center gap-3 justify-between'>
                <Heading>Roles</Heading>
            </nav>
        </main>
    </UserLayout>
  )
}

export default RolesPage