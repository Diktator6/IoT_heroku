// Author: xmrazf00

import { System } from '@components/system'
import Link from 'next/link';

interface SystemCartProps {
  system: System;
}

const SystemCart: React.FC<SystemCartProps> = ({ system }) => {
  return (
    <Link href={`/systems/${system.id}`}>
      <div className="my-2 bg-slate-500 border-solid border-2 rounded" >
        <p>{system.system_name}</p>
        <p>{system.owner__username}</p>
        <p>{system.date_created}</p>
      </div>
    </Link>
  )
}

export default SystemCart