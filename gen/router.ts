import { Router } from "$oak/mod.ts";
import { getQuery } from "$oak/helpers.ts";
import { GetPostByIdPathParams } from './interfaces/operations/getPostById/path-params.ts';
import { GetPostByIdResponseDto } from './interfaces/operations/getPostById/response-body.ts';
import { GetPostsSummaryResponseDto } from './interfaces/operations/getPostsSummary/response-body.ts';
import { GetDocumentationSummaryResponseDto } from './interfaces/operations/getDocumentationSummary/response-body.ts';
import { GetDocumentationSectionPathParams } from './interfaces/operations/getDocumentationSection/path-params.ts';
import { GetDocumentationSectionResponseDto } from './interfaces/operations/getDocumentationSection/response-body.ts';

export type GetPostByIdFunction = (args: {
    params: GetPostByIdPathParams;
}) => {
    body: GetPostByIdResponseDto;
    status?: number;
} | Promise<{
    body: GetPostByIdResponseDto;
    status?: number;
}>;
let getPostById: GetPostByIdFunction | undefined = undefined;
export const registerGetPostByIdFunction = (fn: GetPostByIdFunction) => {
    getPostById = fn;
};

export type GetPostsSummaryFunction = (args: Record<never, never>) => {
    body: GetPostsSummaryResponseDto;
    status?: number;
} | Promise<{
    body: GetPostsSummaryResponseDto;
    status?: number;
}>;
let getPostsSummary: GetPostsSummaryFunction | undefined = undefined;
export const registerGetPostsSummaryFunction = (fn: GetPostsSummaryFunction) => {
    getPostsSummary = fn;
};

export type GetDocumentationSummaryFunction = (args: Record<never, never>) => {
    body: GetDocumentationSummaryResponseDto;
    status?: number;
} | Promise<{
    body: GetDocumentationSummaryResponseDto;
    status?: number;
}>;
let getDocumentationSummary: GetDocumentationSummaryFunction | undefined = undefined;
export const registerGetDocumentationSummaryFunction = (fn: GetDocumentationSummaryFunction) => {
    getDocumentationSummary = fn;
};

export type GetDocumentationSectionFunction = (args: {
    params: GetDocumentationSectionPathParams;
}) => {
    body: GetDocumentationSectionResponseDto;
    status?: number;
} | Promise<{
    body: GetDocumentationSectionResponseDto;
    status?: number;
}>;
let getDocumentationSection: GetDocumentationSectionFunction | undefined = undefined;
export const registerGetDocumentationSectionFunction = (fn: GetDocumentationSectionFunction) => {
    getDocumentationSection = fn;
};


export const router = new Router();
router
    .get<GetPostByIdPathParams>("/post/:id", async (context) => {
        if(!getPostById) {
            context.response.status = 501;
            return;
        }
        const res = await getPostById({
            params: context.params,
        });
        context.response.body = res.body;
        if(res?.status !== undefined) context.response.status = res.status;
    })
    .get("/post", async (context) => {
        if(!getPostsSummary) {
            context.response.status = 501;
            return;
        }
        const res = await getPostsSummary({
            
        });
        context.response.body = res.body;
        if(res?.status !== undefined) context.response.status = res.status;
    })
    .get("/doc", async (context) => {
        if(!getDocumentationSummary) {
            context.response.status = 501;
            return;
        }
        const res = await getDocumentationSummary({
            
        });
        context.response.body = res.body;
        if(res?.status !== undefined) context.response.status = res.status;
    })
    .get<GetDocumentationSectionPathParams>("/doc/:id", async (context) => {
        if(!getDocumentationSection) {
            context.response.status = 501;
            return;
        }
        const res = await getDocumentationSection({
            params: context.params,
        });
        context.response.body = res.body;
        if(res?.status !== undefined) context.response.status = res.status;
    });
