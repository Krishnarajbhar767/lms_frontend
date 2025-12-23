type SkeletonProps = {
    className?: string
}

import SkeletonLib from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const Skeleton = ({ className = "" }: SkeletonProps) => {
    return (
        <div className={className}>
            <SkeletonLib
                baseColor="#6E727F"
                highlightColor="#AFB2BF"
                className="h-full w-full"
                containerClassName="h-full w-full flex"
            />
        </div>
    )
}
