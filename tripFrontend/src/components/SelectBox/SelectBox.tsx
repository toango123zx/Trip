import { cn } from '@/lib';
import React, { JSX } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form';

type TOption = {
    id: string;
    display: string;
    value: string;
}

type TSelectBox = {
    selectOption: TOption[];
    value?: String;
    register?: UseFormRegisterReturn;
    className?: string;
}

export const SelectBox = ({ selectOption, value, register, className }: TSelectBox): JSX.Element => {
    return (
        <section
            className={cn('rounded-4xl py-1 px-3.5 w-full', className)}
            aria-labelledby="search-bar-desktop"
        >
            <select
                {...value}
                className="w-full focus:outline-none"
            >
                {selectOption.map((option) => (
                    <option key={option.id} value={option.value} {...register} className="w-full h-14">
                        {String(option.display)}
                    </option>
                ))}
            </select>
        </section>
    )
}
